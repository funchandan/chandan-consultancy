/**
 * Browser IIFE bundle — registers all GSAP plugins and exposes window globals
 * for static HTML motion modules (assets/motion/*.js).
 */
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { CustomBounce } from "gsap/CustomBounce";
import { CustomWiggle } from "gsap/CustomWiggle";
import { RoughEase, ExpoScaleEase, SlowMo } from "gsap/EasePack";
import { Draggable } from "gsap/Draggable";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { EaselPlugin } from "gsap/EaselPlugin";
import { Flip } from "gsap/Flip";
import { GSDevTools } from "gsap/GSDevTools";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { MotionPathHelper } from "gsap/MotionPathHelper";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { Observer } from "gsap/Observer";
import { Physics2DPlugin } from "gsap/Physics2DPlugin";
import { PhysicsPropsPlugin } from "gsap/PhysicsPropsPlugin";
import { PixiPlugin } from "gsap/PixiPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(
  Draggable,
  DrawSVGPlugin,
  EaselPlugin,
  Flip,
  GSDevTools,
  InertiaPlugin,
  MotionPathHelper,
  MotionPathPlugin,
  MorphSVGPlugin,
  Observer,
  Physics2DPlugin,
  PhysicsPropsPlugin,
  PixiPlugin,
  ScrambleTextPlugin,
  ScrollTrigger,
  ScrollSmoother,
  ScrollToPlugin,
  SplitText,
  TextPlugin,
  RoughEase,
  ExpoScaleEase,
  SlowMo,
  CustomEase,
  CustomBounce,
  CustomWiggle
);

const root = typeof globalThis !== "undefined" ? globalThis : {};

root.gsap = gsap;
root.ScrollTrigger = ScrollTrigger;
root.ScrollSmoother = ScrollSmoother;
root.ScrollToPlugin = ScrollToPlugin;
root.Draggable = Draggable;
root.DrawSVGPlugin = DrawSVGPlugin;
root.EaselPlugin = EaselPlugin;
root.Flip = Flip;
root.GSDevTools = GSDevTools;
root.InertiaPlugin = InertiaPlugin;
root.MotionPathHelper = MotionPathHelper;
root.MotionPathPlugin = MotionPathPlugin;
root.MorphSVGPlugin = MorphSVGPlugin;
root.Observer = Observer;
root.Physics2DPlugin = Physics2DPlugin;
root.PhysicsPropsPlugin = PhysicsPropsPlugin;
root.PixiPlugin = PixiPlugin;
root.ScrambleTextPlugin = ScrambleTextPlugin;
root.SplitText = SplitText;
root.TextPlugin = TextPlugin;
root.CustomEase = CustomEase;
root.CustomBounce = CustomBounce;
root.CustomWiggle = CustomWiggle;
root.RoughEase = RoughEase;
root.ExpoScaleEase = ExpoScaleEase;
root.SlowMo = SlowMo;
