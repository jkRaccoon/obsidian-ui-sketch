import { register } from "./registry";
import { ContainerDef } from "./container";
import { CardDef } from "./card";
import { PanelDef } from "./panel";
import { DividerDef } from "./divider";
import { SpacerDef } from "./spacer";
import { ButtonDef } from "./button";
import { InputDef } from "./input";
import { HeadingDef } from "./heading";
import { TextDef } from "./text";
import { NavbarDef } from "./navbar";

let installed = false;
export function installBuiltinComponents(): void {
  if (installed) return;
  installed = true;
  for (const def of [
    ContainerDef, CardDef, PanelDef, DividerDef, SpacerDef,
    ButtonDef, InputDef, HeadingDef, TextDef, NavbarDef,
  ]) {
    register(def);
  }
}

export { lookup, registeredTypes } from "./registry";
