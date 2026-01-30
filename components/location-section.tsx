import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { LeadForm } from "@/components/lead-form";

export function LocationSection() {
  return (
    <section
      id="contact"
      className="py-16 lg:py-20 bg-background border-t border-border/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Column - Plan your visit */}
          <div className="bg-card border border-border/50 rounded-2xl p-4 sm:p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6 font-serif">
              Plan your visit
            </h2>

            <div className="space-y-6 mb-6">
              {/* First Row: Contact and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Contact */}
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1 text-sm">
                      Contact
                    </h3>
                    <a
                      href="tel:+13052491222"
                      className="text-muted-foreground hover:text-primary transition-colors text-sm block"
                    >
                      +1 (305) 249-1222
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1 text-sm">
                      Email
                    </h3>
                    <a
                      href="mailto:reservations@gdmiami.com"
                      className="text-muted-foreground hover:text-primary transition-colors text-sm block break-all"
                    >
                      reservations@gdmiami.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Second Row: Location and Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Location */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1 text-sm">
                      Location
                    </h3>
                    <a
                      href="https://maps.google.com/?q=300+S+Biscayne+Blvd+Suite+C-202B+Miami+FL+33131"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors text-sm block"
                    >
                      <span className="font-medium">GD Lounge</span>
                      <br />
                      <a
                        href="https://maps.app.goo.gl/odceBHiT9caqxArM7?g_st=ic"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                      >
                        300 S Biscayne Blvd Suite C-202B, Miami, FL 33131, United States
                      </a>
                      States
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1 text-sm">
                      Hours
                    </h3>
                    <ul className="text-muted-foreground text-sm space-y-1">
                      <li>Monday: 9:00 PM – 1:00 AM</li>
                      <li>Tuesday: Closed</li>
                      <li>Wednesday: Closed</li>
                      <li>Thursday: Closed</li>
                      <li>Friday & Saturday: 9:00 PM – 3:00 AM</li>
                      <li>Private Events: Available 24/7</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="w-full h-[200px] sm:h-[280px] rounded-xl overflow-hidden border border-border/50">
              <iframe
                title="Google Maps Location of GD Lounge"
                src="https://www.google.com/maps?q=300+S+Biscayne+Blvd+Suite+C-202B+Miami+FL+33131&output=embed"
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Right Column - Join the VIP List */}
          <div className="bg-card border border-border/50 rounded-2xl p-4 sm:p-6 lg:p-8 [&>div]:text-left [&>div]:border-0 [&>div]:bg-transparent [&>div]:rounded-none [&>div]:p-0 [&_form]:max-w-none [&_h2]:text-xl sm:text-2xl [&_h2]:mb-6 [&_h2]:text-center">
            <LeadForm
              formType="vip"
              title="Join the VIP List"
              description=""
              buttonText="Join VIP List"
              className=""
            />
          </div>
        </div>
      </div>
    </section>
  );
}
