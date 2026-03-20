using MediatR;
using System;

namespace SriGuide.Application.Agencies.Commands;

public record AddGuideToAgencyCommand(Guid AgencyId, Guid GuideId) : IRequest<bool>;
