package com.pinyougou.search.service.impl;

import com.alibaba.dubbo.config.annotation.Service;
import com.pinyougou.pojo.TbItem;
import com.pinyougou.search.service.ItemSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.solr.core.SolrTemplate;
import org.springframework.data.solr.core.query.*;
import org.springframework.data.solr.core.query.result.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service(timeout = 5000)
public class ItemSearchServiceImpl implements ItemSearchService {
    @Autowired
    private SolrTemplate solrTemplate;
    @Override
    public Map<String, Object> search(Map searchMap) {
        //关键字空格处理
        String keywords = (String)searchMap.get("keywords");
        searchMap.put("keywords",keywords.replace(" ",""));
        Map<String,Object> map= new HashMap<>();
        //查询列表
        map.putAll(searchList(searchMap));
        //分组查询
        List<String> list = searchCategoryList(searchMap);
        //查询品牌和规格
        if(list.size()>0){
            map.putAll(searchBrandAndSpecList(list.get(0)));
        }
        map.put("categoryList",list);
        //3.查询品牌和规格列表
        String categoryName=(String)searchMap.get("category");
        if(!"".equals(categoryName)){//如果有分类名称
            map.putAll(searchBrandAndSpecList(categoryName));
        }else{//如果没有分类名称，按照第一个查询
            if(list.size()>0){
                map.putAll(searchBrandAndSpecList(list.get(0)));
            }
        }
        return map;
    }

    /**
     * 导入列表
     * @param list
     */
    @Override
    public void importList(List list) {
        solrTemplate.saveBeans(list);
        solrTemplate.commit();
    }

    /**
     * 删除solr列表数据
     * @param goodsIdList
     */
    @Override
    public void deleteByGoodIds(List goodsIdList) {
        Query query = new SimpleQuery();
        Criteria criteria = new Criteria("item_goodsid").in(goodsIdList);
        query.addCriteria(criteria);
        solrTemplate.delete(query);
        solrTemplate.commit();
    }

    /**
     * 私有方法返回高亮结果页的map集合
     * @param searchMap
     * @return
     */
    private Map searchList(Map searchMap){
        Map map = new HashMap();
        /*高亮显示构建*/
        HighlightQuery query = new SimpleHighlightQuery();
        /*高亮选项，设置那个域，（列）加高亮*/
        HighlightOptions highlightOptions = new HighlightOptions().addField("item_title");
        //设置前缀后缀
        highlightOptions.setSimplePrefix("<em style='color:red'>");//高亮前缀
        highlightOptions.setSimplePostfix("</em>");//高亮后缀
        //把高亮选项设置给query
        query.setHighlightOptions(highlightOptions);
        //1.1
        /*创建条件设置动态域，item_keywords，并分词，根据keywords的值查询*/
        Criteria critera = new Criteria("item_keywords").is(searchMap.get("keywords"));
        query.addCriteria(critera);//查询条件添加进query
        //1.2 按商品分类过略查询
        if(!"".equals(searchMap.get("category"))){
            FilterQuery filter = new SimpleFilterQuery();
            Criteria filterCriteria = new Criteria("item_category").is(searchMap.get("category"));
            filter.addCriteria(filterCriteria);
            query.addFilterQuery(filter);
        }
        //1.3 按品牌分类查询
        if(!"".equals(searchMap.get("brand"))){
            FilterQuery filter = new SimpleFilterQuery();
            Criteria filterCriteria = new Criteria("item_brand").is(searchMap.get("brand"));
            filter.addCriteria(filterCriteria);
            query.addFilterQuery(filter);
        }
        //1.4 按规格过滤
        if(searchMap.get("spec")!=null){
            Map<String,String> specMap= (Map) searchMap.get("spec");
            for(String key:specMap.keySet() ){
                Criteria filterCriteria=new Criteria("item_spec_"+key).is( specMap.get(key) );
                FilterQuery filterQuery=new SimpleFilterQuery(filterCriteria);
                query.addFilterQuery(filterQuery);
            }
        }
        //1.5 按价格过滤
        if(!"".equals(searchMap.get("price"))){
            String[] prices = ((String) searchMap.get("price")).split("-");
            if(!prices[0].equals("0")){ //如果区间起点不等于0
                FilterQuery filter = new SimpleFilterQuery();
                Criteria filterCriteria = new Criteria("item_price").greaterThanEqual(prices[0]);
                filter.addCriteria(filterCriteria);
                query.addFilterQuery(filter);
            }
            if(!prices[1].equals("*")){ //如果区间最高价格不等于*
                FilterQuery filter = new SimpleFilterQuery();
                Criteria filterCriteria = new Criteria("item_price").lessThanEqual(prices[1]);
                filter.addCriteria(filterCriteria);
                query.addFilterQuery(filter);
            }
        }
        //1.6 分页
        Integer pageNo = (Integer) searchMap.get("pageNo");
        if(pageNo==null){ //如果前端没有传来值
            pageNo = 1;
        }
        //获取每页记录数
        Integer pageSize = (Integer) searchMap.get("pageSize");
        if(pageSize==null){ //如果前端没有传来值
            pageSize = 20;
        }
        query.setOffset((pageNo-1)*pageSize); //设置起始页
        query.setRows(pageSize);  //设置每页记录数
        //1.7 排序( 根据价格/新品时间 )
        String sortField = (String) searchMap.get("sortField"); //price
        String sortValue = (String) searchMap.get("sort"); // asc ? desc
        if(sortValue!=null&&!"".equals(sortValue)){
            if(sortValue.equals("ASC")){
                Sort sort = new Sort(Sort.Direction.ASC,"item_"+sortField);
                query.addSort(sort);
            }
            if(sortValue.equals("DESC")){
                Sort sort = new Sort(Sort.Direction.DESC,"item_"+sortField);
                query.addSort(sort);
            }
        }

        //************* 获取高亮结果集 ************
        /*查询高亮页*/
        HighlightPage<TbItem> page = solrTemplate.queryForHighlightPage(query, TbItem.class);
        //获取高亮结果 , 高亮入口集合（每条记录的高亮入口）
        List<HighlightEntry<TbItem>> entryList = page.getHighlighted();
        for (HighlightEntry<TbItem> entry : entryList) {
            //判断是否存在
            if( entry.getHighlights().size()>0 &&  entry.getHighlights().get(0).getSnipplets().size()>0){
                //获取实体
                TbItem item = entry.getEntity();
                //设置高亮的结果
                item.setTitle( entry.getHighlights().get(0).getSnipplets().get(0));
            }
        }
        map.put("rows",page.getContent());  //记录
        map.put("totalPages",page.getTotalPages()); //总页数
        map.put("total",page.getTotalElements());//总记录数
        return map;
    }

    /**
     * 分组查询 商品分类列表
     * @param searchMap
     * @return
     */
    private List searchCategoryList(Map searchMap){
        List<String> list = new ArrayList<>();
        Query query = new SimpleQuery("*:*");
        /*创建条件设置动态域，item_keywords，并分词，根据keywords的值查询（根据关键字查询）*/
        Criteria critera = new Criteria("item_keywords").is(searchMap.get("keywords"));
        query.addCriteria(critera);//查询条件添加进query
        /*设置分组选项*/
        GroupOptions groupOptions = new GroupOptions().addGroupByField("item_category");
        query.setGroupOptions(groupOptions);
        /*获取分组页*/
        GroupPage<TbItem> page = solrTemplate.queryForGroupPage(query, TbItem.class);
        /*获取分组结果对象，page.content 无法直接获取到分组结果*/
        GroupResult<TbItem> groupResult = page.getGroupResult("item_category");
        /*获取分组入口页*/
        Page<GroupEntry<TbItem>> groupEntries = groupResult.getGroupEntries();
        /*获取分组入口集合*/
        List<GroupEntry<TbItem>> content = groupEntries.getContent();
        for (GroupEntry<TbItem> entry : content) {
            /*获取分类集合*/
            list.add(entry.getGroupValue());
        }
        return list;
    }
    @Autowired
    private RedisTemplate redisTemplate;
    private Map searchBrandAndSpecList(String category){
        Map map = new HashMap();
        Long typeId = (Long) redisTemplate.boundHashOps("itemCat").get(category);
        if (typeId!=null){
            List brandList = (List) redisTemplate.boundHashOps("brandList").get(typeId);
            map.put("brandList",brandList);
            List specList = (List) redisTemplate.boundHashOps("specList").get(typeId);
            map.put("specList",specList);
            }
        return map;
    }
}
