namespace IMS.Core.Entities;

public class SalesItem
{
    public int Id { get; set; }
    public int SaleId { get; set; }
    public Sale Sale { get; set; } = null!;
    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal DiscountPercent { get; set; }
    public decimal TaxPercent { get; set; }
    public decimal TotalPrice => Quantity * UnitPrice * (1 - DiscountPercent / 100) * (1 + TaxPercent / 100);

    public ICollection<SalesReturnItem> ReturnItems { get; set; } = new List<SalesReturnItem>();
}

