export function useOnboardingTour() {
  const open = useState<boolean>('onboarding-tour-open', () => false)

  function show() {
    open.value = true
  }

  return { open, show }
}
