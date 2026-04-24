// src/components/index.ts
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
import { SidebarDef } from "./sidebar";
import { TabsDef } from "./tabs";
import { BreadcrumbDef } from "./breadcrumb";
import { PaginationDef } from "./pagination";
import { StepperDef } from "./stepper";
import { TextareaDef } from "./textarea";
import { SelectDef } from "./select";
import { CheckboxDef } from "./checkbox";
import { RadioDef } from "./radio";
import { ToggleDef } from "./toggle";
import { SliderDef } from "./slider";
import { DatePickerDef } from "./date-picker";
import { FileUploadDef } from "./file-upload";
import { SearchDef } from "./search";
import { ImageDef } from "./image";
import { IconDef } from "./icon";
import { AvatarDef } from "./avatar";
import { BadgeDef } from "./badge";
import { TagDef } from "./tag";
import { KbdDef } from "./kbd";
import { AlertDef } from "./alert";
import { ProgressDef } from "./progress";
import { ToastDef } from "./toast";
import { ModalDef } from "./modal";
import { SkeletonDef } from "./skeleton";
import { TableDef } from "./table";
import { ListDef } from "./list";
import { TreeDef } from "./tree";
import { KvListDef } from "./kv-list";
import { ChartDef } from "./chart";
import { MapDef } from "./map";
import { VideoDef } from "./video";
import { PlaceholderDef } from "./placeholder";
import { RawDef } from "./raw";

let installed = false;
export function installBuiltinComponents(): void {
  if (installed) return;
  installed = true;
  for (const def of [
    ContainerDef, CardDef, PanelDef, DividerDef, SpacerDef,
    ButtonDef, InputDef, HeadingDef, TextDef, NavbarDef,
    SidebarDef, TabsDef, BreadcrumbDef, PaginationDef, StepperDef,
    TextareaDef, SelectDef, CheckboxDef, RadioDef,
    ToggleDef, SliderDef, DatePickerDef, FileUploadDef, SearchDef,
    ImageDef, IconDef, AvatarDef, BadgeDef, TagDef, KbdDef,
    AlertDef, ProgressDef, ToastDef, ModalDef, SkeletonDef,
    TableDef, ListDef, TreeDef, KvListDef,
    ChartDef, MapDef, VideoDef, PlaceholderDef,
    RawDef,
  ]) {
    register(def);
  }
}

export { lookup, registeredTypes } from "./registry";
