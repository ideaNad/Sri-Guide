using MediatR;
using SriGuide.Domain.Entities;
using System;
using System.Collections.Generic;

namespace SriGuide.Application.Trips.Commands;

public record ItineraryStepDto(
    string Time,
    string Title,
    string Description,
    string? ImageUrl,
    int Order
);

public record CreateTourCommand(
    Guid? AgencyId,
    Guid? GuideId,
    string Title,
    string Description,
    string Location,
    string? Category,
    decimal Price,
    string? MainImageUrl,
    DateTime? Date,
    List<ItineraryStepDto> Itinerary
) : IRequest<Guid>;
