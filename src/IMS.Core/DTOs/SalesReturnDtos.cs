namespace IMS.Core.DTOs;

public record SalesReturnRequest(
    int SaleId,
    List<ReturnItemRequest> Items,
    string? Reason
);

public record ReturnItemRequest(
    int SalesItemId,
    int Quantity,
    string? Reason
);

public record SalesReturnDto(
    int Id,
    int SaleId,
    string InvoiceNumber,
    decimal TotalRefund,
    string Reason,
    DateTime ReturnDate
);
