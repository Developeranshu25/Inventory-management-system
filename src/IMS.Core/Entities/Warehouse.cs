namespace IMS.Core.Entities;

public class Warehouse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Code { get; set; }
    public string? Address { get; set; }
    public string? ContactPerson { get; set; }
    public string? Phone { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<StockLevel> StockLevels { get; set; } = new List<StockLevel>();
    public ICollection<StockTransaction> StockTransactions { get; set; } = new List<StockTransaction>();
}

