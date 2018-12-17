package com.pinyougou.sellergoods.service;

import com.pinyougou.pojo.TbBrand;
import entity.PageResult;
import entity.Result;

import java.util.List;
import java.util.Map;

/**
 * 品牌接口
 */

public interface BrandService {
    /**
     * 查询所有品牌
     * @return
     */
    public List<TbBrand> findAll();

    /**
     * 分页查询
     * @param pageNum
     * @param pageSize
     * @return
     */
    public PageResult pageFind(int pageNum,int pageSize);

    /**
     * 增加一个品牌
     * @param tbBrand
     */
    public void add(TbBrand tbBrand);

    /**
     * 查找一个实体
     * @param id
     * @return
     */
    public TbBrand findOne(Long id);

    /**
     * 修改一个品牌
     * @param tbBrand
     * @return
     */
    public void update(TbBrand tbBrand);

    /**
     * 删除一个品牌
     * @param id
     */
    public void delete(Long id);

    /**
     * 分页
     * @param tbBrand
     * @param pageNum
     * @param pageSize
     * @return
     */
    public PageResult findPage(TbBrand tbBrand,int pageNum,int pageSize);

    /**
     * 查询下拉列表
     * @return
     */
    public List<Map> selectOptionList();
}
