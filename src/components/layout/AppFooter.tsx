import { Link } from 'react-router-dom';

export default function AppFooter() {
  return (
    <footer className="bg-secondary text-secondary-foreground mt-12">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid gap-8 sm:grid-cols-3">
          {/* Column 1 */}
          <div>
            <h3 className="text-lg font-bold mb-2">Intranet CCC</h3>
            <p className="text-sm text-sidebar-foreground/70 leading-relaxed">
              Portal interno de gestión para empleados. Accede a tus recursos, comunicaciones y beneficios desde un único lugar.
            </p>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-lg font-bold mb-2">Contacto</h3>
            <ul className="space-y-1.5 text-sm text-sidebar-foreground/70">
              <li>📧 soporte@ccc.com</li>
              <li>📧 rrhh@ccc.com</li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-lg font-bold mb-2">Recursos</h3>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link to="/payfit" className="text-sidebar-foreground/70 hover:text-primary transition-colors">
                  Sección Payfit
                </Link>
              </li>
              <li>
                <Link to="/seguridad-it" className="text-sidebar-foreground/70 hover:text-primary transition-colors">
                  Seguridad IT
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-sidebar-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <p className="text-xs text-sidebar-foreground/50 text-center">
            © {new Date().getFullYear()} CCC — Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  );
}
