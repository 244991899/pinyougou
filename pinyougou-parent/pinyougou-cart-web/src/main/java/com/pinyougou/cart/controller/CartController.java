package com.pinyougou.cart.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.fastjson.JSON;
import com.fastDFS.CookieUtil;
import com.pinyougou.cart.service.CartService;
import com.pinyougou.pojogroup.Cart;
import entity.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartController {
    @Reference(timeout = 6000)
    private CartService cartService;
    @Autowired
    private HttpServletRequest request;
    @Autowired
    private HttpServletResponse response;

    /**
     * Cookie购物车列表
     * @return
     */
    @RequestMapping("/findCartList")
    public List<Cart> findCartList(){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
            //读取本地cookie的购物车
            String cartListString = CookieUtil.getCookieValue(request, "cartList", "utf-8");
            if(cartListString==null || cartListString.equals("")){
                cartListString = "[]";
            }
        List<Cart> cartList_cookie = JSON.parseArray(cartListString,Cart.class);
        if(username.equals("anonymousUser")){
            return cartList_cookie;
        }else {
            //从redis中读取
            List<Cart> cartList_redis = cartService.findCartListFromRedis("cartList");
            if(cartList_redis.size()>0){ //如果本地存在购物车
                //合并购物车,以redis为准
                cartList_redis = cartService.mergeCartList(cartList_redis, cartList_cookie);
                //清除本地cookie缓存
                CookieUtil.deleteCookie(request,response,"cartList");
                //将合并后的数据存入redis
                cartService.saveCartListToRedis(username,cartList_redis);
            }
            return cartList_redis;
        }
    }
    @RequestMapping("/addGoodsToCartList")
    public Result addGoodsToCartList(Long itemId,Integer num){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            List<Cart> cartList = findCartList();//获取购物车列表
            cartList = cartService.addGoodsToCartList(cartList,itemId,num);
            if(username.equals("anonymousUser")){ //如果未登录
                CookieUtil.setCookie(request,response,"cartList",JSON.toJSONString(cartList),3600*24,"utf-8");
            }else { //如果登陆
                cartService.saveCartListToRedis(username,cartList);
            }
            return new Result(true,"添加成功");
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(false,"添加失败");
        }
    }

}
