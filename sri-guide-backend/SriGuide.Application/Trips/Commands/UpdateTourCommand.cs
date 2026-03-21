using MediatR;
using System;
using System.Collections.Generic;
using SriGuide.Application.Trips.Queries;

namespace SriGuide.Application.Trips.Commands;

public record UpdateTourCommand(
    Guid TourId,
    Guid? AgencyId,
    Guid? GuideId,
    string? Title,
    string? Description,
    string? Location,
    string? Category,
    string? Duration,
    string? MapLink,
    bool IsActive,
    decimal Price,
    string? MainImageUrl,
    List<string>? AdditionalImages,
    DateTime? Date,
    List<ItineraryStepDto> Itinerary,
    List<TripDayDto> DayDescriptions
) : IRequest<bool>;
