using MediatR;
using System;

namespace SriGuide.Application.Agencies.Commands;

public record RemoveGuideFromAgencyCommand(Guid AgencyId, Guid GuideId) : IRequest<bool>;
