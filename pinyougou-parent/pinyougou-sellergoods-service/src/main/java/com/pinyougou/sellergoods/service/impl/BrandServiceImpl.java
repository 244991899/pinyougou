package com.pinyougou.sellergoods.service.impl;

import com.alibaba.dubbo.config.annotation.Service;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.pinyougou.mapper.TbBrandMapper;
import com.pinyougou.pojo.TbBrand;
import com.pinyougou.pojo.TbBrandExample;
import com.pinyougou.pojo.TbBrandExample.Criteria;
import com.pinyougou.sellergoods.service.BrandService;
import entity.PageResult;
import entity.Result;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Map;

@Service
public class BrandServiceImpl implements BrandService {
    @Autowired
    private TbBrandMapper brandMapper;
    @Override
    public List<TbBrand> findAll() {
        return brandMapper.selectByExample(null);
    }

    /**
     * 分页查询
     * @param pageNum
     * @param pageSize
     * @return
     */
    @Override
    public PageResult pageFind(int pageNum, int pageSize) {
        PageHelper.startPage(pageNum,pageSize);
        Page<TbBrand> tbBrands = (Page<TbBrand>)brandMapper.selectByExample(null);//null查询全部
        return new PageResult(tbBrands.getTotal(),tbBrands.getResult());
    }
    /**
     * 增加一个品牌
     * @param tbBrand
     */
    @Override
    public void add(TbBrand tbBrand) {
        brandMapper.insert(tbBrand);
    }
    /**
     * 查找一个实体
     * @param id
     * @return
     */
    @Override
    public TbBrand findOne(Long id) {
        return brandMapper.selectByPrimaryKey(id);
    }
    /**
     * 修改一个品牌
     * @param tbBrand
     */
    @Override
    public void update(TbBrand tbBrand) {
        brandMapper.updateByPrimaryKey(tbBrand);
        System.out.println("修改");
    }

    /**
     * 删除一个品牌
     * @param id
     */
    @Override
    public void delete(Long id) {
        brandMapper.deleteByPrimaryKey(id);
    }

  @Override
    public PageResult findPage(TbBrand brand, int pageNum, int pageSize) {
        PageHelper.startPage(pageNum,pageSize);
        TbBrandExample example = new TbBrandExample();
        Criteria criteria = example.createCriteria();
        if(brand!=null){
            if(brand.getName()!=null&&brand.getName().length()>0){
                criteria.andNameLike("%"+brand.getName()+"%");
            }
            if(brand.getFirstChar()!=null && brand.getFirstChar().length()>0){
                criteria.andFirstCharLike("%"+brand.getFirstChar()+"%");
            }
        }
        Page<TbBrand> tbBrands = (Page<TbBrand>)brandMapper.selectByExample(example);//null查询全部
        return new PageResult(tbBrands.getTotal(),tbBrands.getResult());
    }

    /**
     * 查询下拉品牌
     * @return
     */
    @Override
    public List<Map> selectOptionList() {
        return brandMapper.selectOptionList();
    }
}
