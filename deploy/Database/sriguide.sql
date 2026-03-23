--
-- PostgreSQL database dump
--

\restrict QNhxI03KY88wso4IvGvXUTWvGN3uw3pKfzAXcFvbRLJKtb3gUy4CVnbRr4IWcSj

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2026-03-23 22:00:50

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 42962)
-- Name: AgencyProfiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AgencyProfiles" (
    "Id" uuid NOT NULL,
    "UserId" uuid NOT NULL,
    "CompanyName" text NOT NULL,
    "CompanyEmail" text,
    "RegistrationNumber" text,
    "Phone" text,
    "WhatsApp" text,
    "VerificationStatus" integer NOT NULL,
    "IsVerified" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    "Bio" text,
    "FacebookLink" text,
    "InstagramLink" text,
    "LinkedinLink" text,
    "TikTokLink" text,
    "TwitterLink" text,
    "YouTubeLink" text,
    "Slug" text
);


ALTER TABLE public."AgencyProfiles" OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 43312)
-- Name: Bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Bookings" (
    "Id" uuid NOT NULL,
    "GuideId" uuid NOT NULL,
    "CustomerId" uuid NOT NULL,
    "BookingDate" timestamp with time zone NOT NULL,
    "Status" integer NOT NULL,
    "TotalAmount" numeric NOT NULL,
    "Notes" text,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    "TourId" uuid,
    "Guests" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."Bookings" OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 43416)
-- Name: Feedbacks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Feedbacks" (
    "Id" uuid NOT NULL,
    "Name" text NOT NULL,
    "Email" text NOT NULL,
    "Subject" text NOT NULL,
    "Message" text NOT NULL,
    "IsReviewed" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone
);


ALTER TABLE public."Feedbacks" OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 42986)
-- Name: GuideProfiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."GuideProfiles" (
    "Id" uuid NOT NULL,
    "UserId" uuid NOT NULL,
    "Bio" text NOT NULL,
    "Languages" text[] NOT NULL,
    "LicenseNumber" text,
    "TwitterLink" text,
    "DailyRate" numeric,
    "HourlyRate" numeric,
    "VerificationStatus" integer NOT NULL,
    "IsVerified" boolean NOT NULL,
    "AgencyId" uuid,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    "IsLegit" boolean DEFAULT false NOT NULL,
    "LicenseExpirationDate" timestamp with time zone,
    "RegistrationNumber" text,
    "ContactForPrice" boolean DEFAULT false NOT NULL,
    "FacebookLink" text,
    "InstagramLink" text,
    "PhoneNumber" text,
    "TikTokLink" text,
    "WhatsAppNumber" text,
    "YouTubeLink" text,
    "LinkedinLink" text,
    "OperatingAreas" text[],
    "Specialties" text[],
    "AgencyRecruitmentStatus" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."GuideProfiles" OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 43577)
-- Name: Inquiries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Inquiries" (
    "Id" uuid NOT NULL,
    "FullName" text NOT NULL,
    "Email" text NOT NULL,
    "Subject" text NOT NULL,
    "Message" text NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone
);


ALTER TABLE public."Inquiries" OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 43584)
-- Name: PopularPlaces; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PopularPlaces" (
    "Id" uuid NOT NULL,
    "Title" character varying(200) NOT NULL,
    "Description" text NOT NULL,
    "ImageUrl" text NOT NULL,
    "ViewCount" integer NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    "MapLink" text,
    "Slug" text
);


ALTER TABLE public."PopularPlaces" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 42974)
-- Name: Reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Reviews" (
    "Id" uuid NOT NULL,
    "UserId" uuid NOT NULL,
    "TargetId" uuid NOT NULL,
    "TargetType" text NOT NULL,
    "Rating" integer NOT NULL,
    "Comment" text,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone
);


ALTER TABLE public."Reviews" OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 43481)
-- Name: TourDays; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TourDays" (
    "Id" uuid NOT NULL,
    "TourId" uuid NOT NULL,
    "DayNumber" integer NOT NULL,
    "Description" text NOT NULL,
    "ImageUrl" text,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone
);


ALTER TABLE public."TourDays" OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 43493)
-- Name: TourImages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TourImages" (
    "Id" uuid NOT NULL,
    "TourId" uuid NOT NULL,
    "ImageUrl" text NOT NULL,
    "Caption" text,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone
);


ALTER TABLE public."TourImages" OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 43505)
-- Name: TourItinerarySteps; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TourItinerarySteps" (
    "Id" uuid NOT NULL,
    "TourId" uuid NOT NULL,
    "Time" text NOT NULL,
    "Title" text NOT NULL,
    "Description" text NOT NULL,
    "ImageUrl" text,
    "DayNumber" integer NOT NULL,
    "Order" integer NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone
);


ALTER TABLE public."TourItinerarySteps" OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 43517)
-- Name: TourLikes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TourLikes" (
    "Id" uuid NOT NULL,
    "TourId" uuid NOT NULL,
    "UserId" uuid NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone
);


ALTER TABLE public."TourLikes" OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 43469)
-- Name: Tours; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Tours" (
    "Id" uuid NOT NULL,
    "AgencyId" uuid NOT NULL,
    "Title" text NOT NULL,
    "Description" text NOT NULL,
    "Location" text NOT NULL,
    "Category" text,
    "Duration" text,
    "MapLink" text,
    "Price" numeric NOT NULL,
    "MainImageUrl" text,
    "IsActive" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    "Slug" text
);


ALTER TABLE public."Tours" OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 43346)
-- Name: TripImages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TripImages" (
    "Id" uuid NOT NULL,
    "TripId" uuid NOT NULL,
    "ImageUrl" text NOT NULL,
    "Caption" text,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone
);


ALTER TABLE public."TripImages" OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 43364)
-- Name: TripLikes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TripLikes" (
    "Id" uuid NOT NULL,
    "UserId" uuid NOT NULL,
    "TripId" uuid NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone
);


ALTER TABLE public."TripLikes" OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 43329)
-- Name: Trips; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Trips" (
    "Id" uuid NOT NULL,
    "GuideId" uuid,
    "Title" text NOT NULL,
    "Description" text NOT NULL,
    "Location" text NOT NULL,
    "Date" timestamp with time zone,
    "GuideProfileId" uuid,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    "AgencyId" uuid,
    "IsActive" boolean DEFAULT false NOT NULL,
    "MainImageUrl" text,
    "ViewCount" integer DEFAULT 0 NOT NULL,
    "Slug" text
);


ALTER TABLE public."Trips" OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 42955)
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    "Id" uuid NOT NULL,
    "FullName" text NOT NULL,
    "Email" text NOT NULL,
    "PasswordHash" text NOT NULL,
    "PhoneNumber" text,
    "ProfileImageUrl" text,
    "Role" integer NOT NULL,
    "IsVerified" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    "PasswordResetToken" text,
    "ResetTokenExpires" timestamp with time zone,
    "Slug" text,
    "Budget" text,
    "Interests" text,
    "OnboardingCompleted" boolean DEFAULT false NOT NULL,
    "PreferredLocation" text,
    "TravelDuration" text
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 42950)
-- Name: __EFMigrationsHistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL
);


ALTER TABLE public."__EFMigrationsHistory" OWNER TO postgres;

--
-- TOC entry 4819 (class 2606 OID 42968)
-- Name: AgencyProfiles PK_AgencyProfiles; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AgencyProfiles"
    ADD CONSTRAINT "PK_AgencyProfiles" PRIMARY KEY ("Id");


--
-- TOC entry 4831 (class 2606 OID 43318)
-- Name: Bookings PK_Bookings; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Bookings"
    ADD CONSTRAINT "PK_Bookings" PRIMARY KEY ("Id");


--
-- TOC entry 4845 (class 2606 OID 43422)
-- Name: Feedbacks PK_Feedbacks; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Feedbacks"
    ADD CONSTRAINT "PK_Feedbacks" PRIMARY KEY ("Id");


--
-- TOC entry 4826 (class 2606 OID 42992)
-- Name: GuideProfiles PK_GuideProfiles; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GuideProfiles"
    ADD CONSTRAINT "PK_GuideProfiles" PRIMARY KEY ("Id");


--
-- TOC entry 4863 (class 2606 OID 43583)
-- Name: Inquiries PK_Inquiries; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Inquiries"
    ADD CONSTRAINT "PK_Inquiries" PRIMARY KEY ("Id");


--
-- TOC entry 4865 (class 2606 OID 43590)
-- Name: PopularPlaces PK_PopularPlaces; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PopularPlaces"
    ADD CONSTRAINT "PK_PopularPlaces" PRIMARY KEY ("Id");


--
-- TOC entry 4822 (class 2606 OID 42980)
-- Name: Reviews PK_Reviews; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Reviews"
    ADD CONSTRAINT "PK_Reviews" PRIMARY KEY ("Id");


--
-- TOC entry 4851 (class 2606 OID 43487)
-- Name: TourDays PK_TourDays; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TourDays"
    ADD CONSTRAINT "PK_TourDays" PRIMARY KEY ("Id");


--
-- TOC entry 4854 (class 2606 OID 43499)
-- Name: TourImages PK_TourImages; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TourImages"
    ADD CONSTRAINT "PK_TourImages" PRIMARY KEY ("Id");


--
-- TOC entry 4857 (class 2606 OID 43511)
-- Name: TourItinerarySteps PK_TourItinerarySteps; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TourItinerarySteps"
    ADD CONSTRAINT "PK_TourItinerarySteps" PRIMARY KEY ("Id");


--
-- TOC entry 4861 (class 2606 OID 43521)
-- Name: TourLikes PK_TourLikes; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TourLikes"
    ADD CONSTRAINT "PK_TourLikes" PRIMARY KEY ("Id");


--
-- TOC entry 4848 (class 2606 OID 43475)
-- Name: Tours PK_Tours; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tours"
    ADD CONSTRAINT "PK_Tours" PRIMARY KEY ("Id");


--
-- TOC entry 4839 (class 2606 OID 43352)
-- Name: TripImages PK_TripImages; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TripImages"
    ADD CONSTRAINT "PK_TripImages" PRIMARY KEY ("Id");


--
-- TOC entry 4843 (class 2606 OID 43368)
-- Name: TripLikes PK_TripLikes; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TripLikes"
    ADD CONSTRAINT "PK_TripLikes" PRIMARY KEY ("Id");


--
-- TOC entry 4836 (class 2606 OID 43335)
-- Name: Trips PK_Trips; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Trips"
    ADD CONSTRAINT "PK_Trips" PRIMARY KEY ("Id");


--
-- TOC entry 4816 (class 2606 OID 42961)
-- Name: Users PK_Users; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "PK_Users" PRIMARY KEY ("Id");


--
-- TOC entry 4813 (class 2606 OID 42954)
-- Name: __EFMigrationsHistory PK___EFMigrationsHistory; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."__EFMigrationsHistory"
    ADD CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId");


--
-- TOC entry 4817 (class 1259 OID 43003)
-- Name: IX_AgencyProfiles_UserId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IX_AgencyProfiles_UserId" ON public."AgencyProfiles" USING btree ("UserId");


--
-- TOC entry 4827 (class 1259 OID 43358)
-- Name: IX_Bookings_CustomerId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_Bookings_CustomerId" ON public."Bookings" USING btree ("CustomerId");


--
-- TOC entry 4828 (class 1259 OID 43359)
-- Name: IX_Bookings_GuideId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_Bookings_GuideId" ON public."Bookings" USING btree ("GuideId");


--
-- TOC entry 4829 (class 1259 OID 43381)
-- Name: IX_Bookings_TourId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_Bookings_TourId" ON public."Bookings" USING btree ("TourId");


--
-- TOC entry 4823 (class 1259 OID 43004)
-- Name: IX_GuideProfiles_AgencyId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_GuideProfiles_AgencyId" ON public."GuideProfiles" USING btree ("AgencyId");


--
-- TOC entry 4824 (class 1259 OID 43005)
-- Name: IX_GuideProfiles_UserId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IX_GuideProfiles_UserId" ON public."GuideProfiles" USING btree ("UserId");


--
-- TOC entry 4820 (class 1259 OID 43006)
-- Name: IX_Reviews_UserId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_Reviews_UserId" ON public."Reviews" USING btree ("UserId");


--
-- TOC entry 4849 (class 1259 OID 43538)
-- Name: IX_TourDays_TourId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_TourDays_TourId" ON public."TourDays" USING btree ("TourId");


--
-- TOC entry 4852 (class 1259 OID 43539)
-- Name: IX_TourImages_TourId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_TourImages_TourId" ON public."TourImages" USING btree ("TourId");


--
-- TOC entry 4855 (class 1259 OID 43540)
-- Name: IX_TourItinerarySteps_TourId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_TourItinerarySteps_TourId" ON public."TourItinerarySteps" USING btree ("TourId");


--
-- TOC entry 4858 (class 1259 OID 43541)
-- Name: IX_TourLikes_TourId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_TourLikes_TourId" ON public."TourLikes" USING btree ("TourId");


--
-- TOC entry 4859 (class 1259 OID 43542)
-- Name: IX_TourLikes_UserId_TourId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IX_TourLikes_UserId_TourId" ON public."TourLikes" USING btree ("UserId", "TourId");


--
-- TOC entry 4846 (class 1259 OID 43543)
-- Name: IX_Tours_AgencyId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_Tours_AgencyId" ON public."Tours" USING btree ("AgencyId");


--
-- TOC entry 4837 (class 1259 OID 43360)
-- Name: IX_TripImages_TripId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_TripImages_TripId" ON public."TripImages" USING btree ("TripId");


--
-- TOC entry 4840 (class 1259 OID 43379)
-- Name: IX_TripLikes_TripId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_TripLikes_TripId" ON public."TripLikes" USING btree ("TripId");


--
-- TOC entry 4841 (class 1259 OID 43380)
-- Name: IX_TripLikes_UserId_TripId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IX_TripLikes_UserId_TripId" ON public."TripLikes" USING btree ("UserId", "TripId");


--
-- TOC entry 4832 (class 1259 OID 43401)
-- Name: IX_Trips_AgencyId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_Trips_AgencyId" ON public."Trips" USING btree ("AgencyId");


--
-- TOC entry 4833 (class 1259 OID 43361)
-- Name: IX_Trips_GuideId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_Trips_GuideId" ON public."Trips" USING btree ("GuideId");


--
-- TOC entry 4834 (class 1259 OID 43362)
-- Name: IX_Trips_GuideProfileId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_Trips_GuideProfileId" ON public."Trips" USING btree ("GuideProfileId");


--
-- TOC entry 4814 (class 1259 OID 43007)
-- Name: IX_Users_Email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IX_Users_Email" ON public."Users" USING btree ("Email");


--
-- TOC entry 4866 (class 2606 OID 42969)
-- Name: AgencyProfiles FK_AgencyProfiles_Users_UserId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AgencyProfiles"
    ADD CONSTRAINT "FK_AgencyProfiles_Users_UserId" FOREIGN KEY ("UserId") REFERENCES public."Users"("Id") ON DELETE CASCADE;


--
-- TOC entry 4870 (class 2606 OID 43532)
-- Name: Bookings FK_Bookings_Tours_TourId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Bookings"
    ADD CONSTRAINT "FK_Bookings_Tours_TourId" FOREIGN KEY ("TourId") REFERENCES public."Tours"("Id") ON DELETE SET NULL;


--
-- TOC entry 4871 (class 2606 OID 43319)
-- Name: Bookings FK_Bookings_Users_CustomerId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Bookings"
    ADD CONSTRAINT "FK_Bookings_Users_CustomerId" FOREIGN KEY ("CustomerId") REFERENCES public."Users"("Id");


--
-- TOC entry 4872 (class 2606 OID 43324)
-- Name: Bookings FK_Bookings_Users_GuideId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Bookings"
    ADD CONSTRAINT "FK_Bookings_Users_GuideId" FOREIGN KEY ("GuideId") REFERENCES public."Users"("Id");


--
-- TOC entry 4868 (class 2606 OID 42993)
-- Name: GuideProfiles FK_GuideProfiles_AgencyProfiles_AgencyId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GuideProfiles"
    ADD CONSTRAINT "FK_GuideProfiles_AgencyProfiles_AgencyId" FOREIGN KEY ("AgencyId") REFERENCES public."AgencyProfiles"("Id") ON DELETE SET NULL;


--
-- TOC entry 4869 (class 2606 OID 42998)
-- Name: GuideProfiles FK_GuideProfiles_Users_UserId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GuideProfiles"
    ADD CONSTRAINT "FK_GuideProfiles_Users_UserId" FOREIGN KEY ("UserId") REFERENCES public."Users"("Id") ON DELETE CASCADE;


--
-- TOC entry 4867 (class 2606 OID 42981)
-- Name: Reviews FK_Reviews_Users_UserId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Reviews"
    ADD CONSTRAINT "FK_Reviews_Users_UserId" FOREIGN KEY ("UserId") REFERENCES public."Users"("Id") ON DELETE CASCADE;


--
-- TOC entry 4880 (class 2606 OID 43488)
-- Name: TourDays FK_TourDays_Tours_TourId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TourDays"
    ADD CONSTRAINT "FK_TourDays_Tours_TourId" FOREIGN KEY ("TourId") REFERENCES public."Tours"("Id") ON DELETE CASCADE;


--
-- TOC entry 4881 (class 2606 OID 43500)
-- Name: TourImages FK_TourImages_Tours_TourId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TourImages"
    ADD CONSTRAINT "FK_TourImages_Tours_TourId" FOREIGN KEY ("TourId") REFERENCES public."Tours"("Id") ON DELETE CASCADE;


--
-- TOC entry 4882 (class 2606 OID 43512)
-- Name: TourItinerarySteps FK_TourItinerarySteps_Tours_TourId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TourItinerarySteps"
    ADD CONSTRAINT "FK_TourItinerarySteps_Tours_TourId" FOREIGN KEY ("TourId") REFERENCES public."Tours"("Id") ON DELETE CASCADE;


--
-- TOC entry 4883 (class 2606 OID 43522)
-- Name: TourLikes FK_TourLikes_Tours_TourId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TourLikes"
    ADD CONSTRAINT "FK_TourLikes_Tours_TourId" FOREIGN KEY ("TourId") REFERENCES public."Tours"("Id") ON DELETE CASCADE;


--
-- TOC entry 4884 (class 2606 OID 43527)
-- Name: TourLikes FK_TourLikes_Users_UserId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TourLikes"
    ADD CONSTRAINT "FK_TourLikes_Users_UserId" FOREIGN KEY ("UserId") REFERENCES public."Users"("Id") ON DELETE CASCADE;


--
-- TOC entry 4879 (class 2606 OID 43476)
-- Name: Tours FK_Tours_AgencyProfiles_AgencyId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tours"
    ADD CONSTRAINT "FK_Tours_AgencyProfiles_AgencyId" FOREIGN KEY ("AgencyId") REFERENCES public."AgencyProfiles"("Id") ON DELETE CASCADE;


--
-- TOC entry 4876 (class 2606 OID 43353)
-- Name: TripImages FK_TripImages_Trips_TripId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TripImages"
    ADD CONSTRAINT "FK_TripImages_Trips_TripId" FOREIGN KEY ("TripId") REFERENCES public."Trips"("Id") ON DELETE CASCADE;


--
-- TOC entry 4877 (class 2606 OID 43369)
-- Name: TripLikes FK_TripLikes_Trips_TripId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TripLikes"
    ADD CONSTRAINT "FK_TripLikes_Trips_TripId" FOREIGN KEY ("TripId") REFERENCES public."Trips"("Id") ON DELETE CASCADE;


--
-- TOC entry 4878 (class 2606 OID 43374)
-- Name: TripLikes FK_TripLikes_Users_UserId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TripLikes"
    ADD CONSTRAINT "FK_TripLikes_Users_UserId" FOREIGN KEY ("UserId") REFERENCES public."Users"("Id") ON DELETE CASCADE;


--
-- TOC entry 4873 (class 2606 OID 43403)
-- Name: Trips FK_Trips_AgencyProfiles_AgencyId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Trips"
    ADD CONSTRAINT "FK_Trips_AgencyProfiles_AgencyId" FOREIGN KEY ("AgencyId") REFERENCES public."AgencyProfiles"("Id") ON DELETE SET NULL;


--
-- TOC entry 4874 (class 2606 OID 43336)
-- Name: Trips FK_Trips_GuideProfiles_GuideProfileId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Trips"
    ADD CONSTRAINT "FK_Trips_GuideProfiles_GuideProfileId" FOREIGN KEY ("GuideProfileId") REFERENCES public."GuideProfiles"("Id");


--
-- TOC entry 4875 (class 2606 OID 43409)
-- Name: Trips FK_Trips_Users_GuideId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Trips"
    ADD CONSTRAINT "FK_Trips_Users_GuideId" FOREIGN KEY ("GuideId") REFERENCES public."Users"("Id");


-- Completed on 2026-03-23 22:00:50

--
-- PostgreSQL database dump complete
--

\unrestrict QNhxI03KY88wso4IvGvXUTWvGN3uw3pKfzAXcFvbRLJKtb3gUy4CVnbRr4IWcSj

