
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopyright } from '@fortawesome/free-regular-svg-icons';

export function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-borel text-lg text-text-primary flex items-center gap-2">
            Kama Pajamas
          </div>
          <p className="text-sm text-text-muted">
            <FontAwesomeIcon icon={faCopyright} /> 2026 Kama Pajamas. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}
