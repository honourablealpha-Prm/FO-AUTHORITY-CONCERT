document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();
  const form = document.getElementById('guestRegistrationForm');
  const feedback = document.getElementById('formFeedback');
  if (!form || !feedback) return;

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    // Front-end demonstration only. Connect a secure backend before collecting real registrations.
    feedback.textContent = 'Your form is validated. Online registration will be enabled once the event database is connected.';
  });
});
