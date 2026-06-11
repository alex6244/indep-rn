import { useAuth } from "../../contexts/AuthContext";
import { useProtected } from "../../hooks/useProtected";
import { getMainBurgerMenuItems } from "./mainBurgerMenu";

export function useMainBurgerMenuItems() {
  const { user } = useAuth();
  const { checkAuth } = useProtected();
  return getMainBurgerMenuItems(user?.role, { checkAuth });
}
