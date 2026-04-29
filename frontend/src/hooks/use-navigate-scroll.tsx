import { useNavigate } from 'react-router-dom';

export function useNavigateWithScroll() {
  const navigate = useNavigate();

  const navigateWithScroll = (to: string, options?: { replace?: boolean }) => {
    navigate(to, options);
    // The ScrollToTop component will automatically handle the scrolling
    // when the route changes, so we don't need to manually scroll here
  };

  return navigateWithScroll;
}