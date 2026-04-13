namespace IMS.Core.Entities;

public class Alert
{
    public int Id { get; set; }
    public string AlertType { get; set; } = string.Empty; // LowStock, Expiry, Overstock, PendingOrder
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public int? ProductId { get; set; }
    public Product? Product { get; set; }
    public string Severity { get; set; } = "Info"; // Info, Warning, Critical
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

