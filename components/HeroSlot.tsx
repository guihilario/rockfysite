import { HeroWordpress } from "@/components/heroes/HeroWordpress.tsx";
import { HeroLoja } from "@/components/heroes/HeroLoja.tsx";
import { HeroEmail } from "@/components/heroes/HeroEmail.tsx";
import { HeroElementor } from "@/components/heroes/HeroElementor.tsx";
import { HeroDeploy } from "@/components/heroes/DeployStage.tsx";

/** O slot de heros da home: os cinco painéis no DOM, um visível por vez.
 *  Ficam todos servidos para a troca pelo chip ser instantânea. */
export function HeroSlot() {
  return (
    <div class="hero-slot" id="heroSlot">
      <HeroWordpress />
      <HeroLoja oculto />
      <HeroEmail oculto />
      <HeroElementor oculto />
      <HeroDeploy oculto />
    </div>
  );
}
