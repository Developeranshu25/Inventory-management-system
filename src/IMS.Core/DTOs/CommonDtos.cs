namespace IMS.Core.DTOs;

public record PagedResult<T>(List<T> Items, int TotalCount, int Page, int PageSize);

