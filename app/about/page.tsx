import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { GraduationCap } from "lucide-react"

export const metadata = {
  title: "Sobre Nosotros | noporolos store",
  description: "Conoce al equipo detrás de noporolos store, estudiantes de la UCN.",
}

const team = [
  {
    name: "Nicolas Galleguillos",
    role: "Desarrollador & Co-fundador",
    initials: "NG",
  },
  {
    name: "Vicente Ruiz",
    role: "Desarrollador & Co-fundador",
    initials: "VR",
  },
  {
    name: "Abraham Sepúlveda",
    role: "Desarrollador & Co-fundador",
    initials: "AS",
  },
]

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-voodoo-950 text-white py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-voodoo-600/20 blur-3xl"></div>
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-voodoo-500/10 blur-3xl"></div>
        
        <div className="container mx-auto max-w-4xl relative z-10 text-center space-y-6">
          <div className="inline-flex items-center rounded-full border border-voodoo-700 bg-voodoo-900/50 px-4 py-1.5 text-sm font-medium backdrop-blur-md">
            <GraduationCap className="mr-2 h-4 w-4 text-voodoo-400" />
            <span className="text-voodoo-100">Estudiantes UCN</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Creamos soluciones para <span className="text-transparent bg-clip-text bg-gradient-to-r from-voodoo-300 to-voodoo-500">estudiantes como nosotros</span>
          </h1>
          <p className="text-xl text-voodoo-200 max-w-2xl mx-auto font-light leading-relaxed">
            Nacimos en las aulas de la Universidad Católica del Norte con una misión simple: facilitar la vida universitaria a través de tecnología accesible.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 max-w-6xl mb-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-voodoo-950 dark:text-voodoo-50 mb-4">El Equipo</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member) => (
            <Card key={member.name} className="border-voodoo-100 dark:border-voodoo-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
              <CardContent className="pt-8 pb-8 flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4 border-4 border-voodoo-50 dark:border-voodoo-900 shadow-md group-hover:scale-105 transition-transform">
                  <AvatarFallback className="bg-voodoo-100 text-voodoo-700 text-xl font-bold dark:bg-voodoo-800 dark:text-voodoo-200">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold text-voodoo-900 dark:text-voodoo-50 mb-1">{member.name}</h3>
                <p className="text-voodoo-600 dark:text-voodoo-400 text-sm mb-4">{member.role}</p>
                <div className="w-12 h-1 bg-voodoo-200 dark:bg-voodoo-800 rounded-full group-hover:bg-voodoo-500 transition-colors"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
