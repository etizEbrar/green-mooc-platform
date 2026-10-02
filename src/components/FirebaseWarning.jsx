import { firebaseConfig } from '../firebase';
import Icon from './Icon';

const PLACEHOLDERS = [
  'YOUR_API_KEY',
  'YOUR_AUTH_DOMAIN',
  'YOUR_PROJECT_ID',
  'YOUR_STORAGE_BUCKET',
  'YOUR_MESSAGING_SENDER_ID',
  'YOUR_APP_ID'
];

export default function FirebaseWarning() {
  const hasPlaceholder = Object.values(firebaseConfig).some((v) =>
    PLACEHOLDERS.includes(v)
  );

  if (!hasPlaceholder) return null;

  return (
    <div className="firebase-warning" role="alert">
      <div className="firebase-warning__inner">
        <span className="firebase-warning__icon"><Icon name="warning" size={20} /></span>
        <div>
          <strong>Firebase not configured</strong>
          <p>
            The file <code>src/firebase.js</code> still contains placeholder values
            (e.g. <code>YOUR_API_KEY</code>). Authentication and data saving will not
            work until you add your real Firebase config. See{' '}
            <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer">
              Firebase Console
            </a>{' '}
            → Project Settings → Your apps.
          </p>
        </div>
      </div>
    </div>
  );
}
