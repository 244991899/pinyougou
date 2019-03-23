package com.pinyougou.pay.service.impl;

import com.alibaba.dubbo.config.annotation.Service;
import com.fastDFS.HttpClient;
import com.github.wxpay.sdk.WXPayUtil;
import com.pinyougou.pay.service.WeixinPayService;
import org.springframework.beans.factory.annotation.Value;

import java.util.HashMap;
import java.util.Map;
@Service
public class WeixinPayServiceImpl implements WeixinPayService {
    @Value("${appid}")
    private String appid;
    @Value("${partner}")
    private String partner;
    @Value("${partnerkey}")
    private String partnerkey;
    @Value("${notifyurl}")
    private String notifyurl;
    /**
     * 生成微信支付二维码
     * @param out_trade_no  订单号
     * @param total_fee   金额
     * @return
     */
    @Override
    public Map createNative(String out_trade_no, String total_fee) {
        //创建参数
        Map<String,String> parm = new HashMap<>();
        parm.put("appid",appid); //公众号
        parm.put("mch_id",partner); //商户号
        parm.put("nonce_str",WXPayUtil.generateNonceStr()); //随机字符串
        parm.put("body","评优狗");//商品描述
        parm.put("out_trade_no",out_trade_no);//商户订单号
        parm.put("total_fee",total_fee); ////总金额（分）
        parm.put("spbill_create_ip","127.0.0.1"); //IP
        parm.put("notify_url","http://test.xxx.com"); //回调地址
        parm.put("trade_type","NATIVE"); //交易类型
        try {
            //发送xml给微信接口
            String xmlParam = WXPayUtil.generateSignedXml(parm, partnerkey);
            System.out.println(xmlParam);
            HttpClient client = new HttpClient("https://api.mch.weixin.qq.com/pay/unifiedorder");
            client.setHttps(true);
            client.setXmlParam(xmlParam);
            client.post();
            //接收微信接口返回的结果
            String result = client.getContent();
            System.out.println(result);
            /*获取的xml的string格式转换成map集合*/
            Map<String, String> resultMap = WXPayUtil.xmlToMap(result);
            Map<String,String> map = new HashMap<>();
            map.put("code_url",resultMap.get("code_url")); //支付地址
            map.put("total_fee",total_fee);  //总金额
            map.put("out_trade_no",out_trade_no); //订单号
            return map;
        }catch (Exception e){
            e.printStackTrace();
            return new HashMap<>();
        }
    }

    /**
     * 查询订单状态
     * @param out_trade_no
     * @return
     */
    public Map queryPayStatus(String out_trade_no){
        //创建参数
        Map<String,String> param = new HashMap<>();
        param.put("appid",appid);
        param.put("mch_id",partner);
        param.put("out_trade_no",out_trade_no);
        param.put("nonce_str",WXPayUtil.generateNonceStr()); //随机字符串
        try {
            String signedXml = WXPayUtil.generateSignedXml(param, partnerkey);
            HttpClient client = new HttpClient("https://api.mch.weixin.qq.com/pay/orderquery");
            client.setHttps(true);
            client.setXmlParam(signedXml);
            client.post();
            //接收返回的结果
            String result = client.getContent();
            Map<String, String> map = WXPayUtil.xmlToMap(result); // 把返回的结果转换成map集合
            return map;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 关闭订单
     * @param out_trade_no
     * @return
     */
    @Override
    public Map closePay(String out_trade_no) {
        Map param=new HashMap();
        param.put("appid", appid);//公众账号 ID
        param.put("mch_id", partner);//商户号
        param.put("out_trade_no", out_trade_no);//订单号
        param.put("nonce_str", WXPayUtil.generateNonceStr());//随机字符串
        String url="https://api.mch.weixin.qq.com/pay/closeorder";
        try {
            String xmlParam = WXPayUtil.generateSignedXml(param, partnerkey);
            HttpClient client=new HttpClient(url);
            client.setHttps(true);
            client.setXmlParam(xmlParam);
            client.post();
            String result = client.getContent();
            Map<String, String> map = WXPayUtil.xmlToMap(result);
            System.out.println(map);
            return map;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
