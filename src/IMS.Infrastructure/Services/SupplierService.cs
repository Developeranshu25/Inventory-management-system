using IMS.Core.DTOs;
using IMS.Core.Entities;
using IMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace IMS.Infrastructure.Services;

public class SupplierService
{
    private readonly ApplicationDbContext _db;

    public SupplierService(ApplicationDbContext db) => _db = db;

    public async Task<PagedResult<SupplierDto>> GetAllAsync(int page = 1, int pageSize = 20, string? search = null)
    {
        var query = _db.Suppliers.AsQueryable();
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(s => s.Name.Contains(search) || (s.Email != null && s.Email.Contains(search)));

        var total = await query.CountAsync();
        var items = await query.OrderBy(s => s.Name).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        return new PagedResult<SupplierDto>(items.Select(MapToDto).ToList(), total, page, pageSize);
    }

    public async Task<SupplierDto?> GetByIdAsync(int id)
    {
        var s = await _db.Suppliers.FindAsync(id);
        return s == null ? null : MapToDto(s);
    }

    public async Task<SupplierDto> CreateAsync(CreateSupplierRequest req)
    {
        var s = new Supplier
        {
            Name = req.Name,
            Phone = req.Phone,
            Email = req.Email,
            Address = req.Address,
            GstTaxId = req.GstTaxId,
            ContactPerson = req.ContactPerson
        };
        _db.Suppliers.Add(s);
        await _db.SaveChangesAsync();
        return MapToDto(s);
    }

    public async Task<SupplierDto?> UpdateAsync(int id, UpdateSupplierRequest req)
    {
        var s = await _db.Suppliers.FindAsync(id);
        if (s == null) return null;

        if (req.Name != null) s.Name = req.Name;
        if (req.Phone != null) s.Phone = req.Phone;
        if (req.Email != null) s.Email = req.Email;
        if (req.Address != null) s.Address = req.Address;
        if (req.GstTaxId != null) s.GstTaxId = req.GstTaxId;
        if (req.ContactPerson != null) s.ContactPerson = req.ContactPerson;
        if (req.IsActive.HasValue) s.IsActive = req.IsActive.Value;

        await _db.SaveChangesAsync();
        return MapToDto(s);
    }

    private static SupplierDto MapToDto(Supplier s) =>
        new(s.Id, s.Name, s.Phone, s.Email, s.Address, s.GstTaxId, s.ContactPerson, s.IsActive, s.CreatedAt);
}

