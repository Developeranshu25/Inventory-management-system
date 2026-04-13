using IMS.Core.DTOs;
using IMS.Core.Entities;
using IMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace IMS.Infrastructure.Services;

public class WarehouseService
{
    private readonly ApplicationDbContext _db;

    public WarehouseService(ApplicationDbContext db) => _db = db;

    public async Task<List<WarehouseDto>> GetAllAsync()
    {
        var list = await _db.Warehouses.Where(w => w.IsActive).OrderBy(w => w.Name).ToListAsync();
        return list.Select(MapToDto).ToList();
    }

    public async Task<WarehouseDto?> GetByIdAsync(int id)
    {
        var w = await _db.Warehouses.FindAsync(id);
        return w == null ? null : MapToDto(w);
    }

    public async Task<WarehouseDto> CreateAsync(CreateWarehouseRequest req)
    {
        var w = new Warehouse
        {
            Name = req.Name,
            Code = req.Code,
            Address = req.Address,
            ContactPerson = req.ContactPerson,
            Phone = req.Phone
        };
        _db.Warehouses.Add(w);
        await _db.SaveChangesAsync();
        return MapToDto(w);
    }

    public async Task<WarehouseDto?> UpdateAsync(int id, UpdateWarehouseRequest req)
    {
        var w = await _db.Warehouses.FindAsync(id);
        if (w == null) return null;

        if (req.Name != null) w.Name = req.Name;
        if (req.Code != null) w.Code = req.Code;
        if (req.Address != null) w.Address = req.Address;
        if (req.ContactPerson != null) w.ContactPerson = req.ContactPerson;
        if (req.Phone != null) w.Phone = req.Phone;
        if (req.IsActive.HasValue) w.IsActive = req.IsActive.Value;

        await _db.SaveChangesAsync();
        return MapToDto(w);
    }

    private static WarehouseDto MapToDto(Warehouse w) =>
        new(w.Id, w.Name, w.Code, w.Address, w.ContactPerson, w.Phone, w.IsActive, w.CreatedAt);
}

