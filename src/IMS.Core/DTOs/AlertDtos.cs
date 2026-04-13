namespace IMS.Core.DTOs;

public record AlertDto(
    int Id,
    string AlertType,
    string Title,
    string Message,
    int? ProductId,
    string? ProductName,
    string Severity,
    bool IsRead,
    DateTime CreatedAt
);

