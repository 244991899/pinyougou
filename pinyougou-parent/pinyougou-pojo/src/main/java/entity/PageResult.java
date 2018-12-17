package entity;

import java.io.Serializable;
import java.util.List;

/**
 * 分页类
 */
public class PageResult implements Serializable {
    private Long total; //总记录数
    private List rows; //查询的结果

    public PageResult() {
    }

    public PageResult(Long total, List rows) {
        this.total = total;
        this.rows = rows;
    }

    public Long getTotal() {
        return total;
    }

    public void setTotal(Long total) {
        this.total = total;
    }

    public List getRows() {
        return rows;
    }

    public void setRows(List rows) {
        this.rows = rows;
    }
}
