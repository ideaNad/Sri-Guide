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
    int DayNumber,
    int Order
);

public record CreateTourCommand(
    Guid? AgencyId,
    Guid? GuideId,
    string Title,
    string Description,
    string? Location,
    string? Category,
    string? Duration,
    string? MapLink,
    decimal Price,
    string? MainImageUrl,
    List<string>? AdditionalImages,
    DateTime? Date,
    List<ItineraryStepDto> Itinerary
) : IRequest<Guid>;
