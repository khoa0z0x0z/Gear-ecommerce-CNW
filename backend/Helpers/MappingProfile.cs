using AutoMapper;
using backend.Models;
using backend.DTOs;

namespace backend.Helpers;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Product, ProductDto>().ReverseMap();
    }
}
