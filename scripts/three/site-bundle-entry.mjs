/**
 * Browser IIFE — THREE core + FirstPersonControls for static motion modules.
 */
import * as THREE_NS from "three";
import { FirstPersonControls } from "three/addons/controls/FirstPersonControls.js";

const THREE = { ...THREE_NS, FirstPersonControls };

const root = typeof globalThis !== "undefined" ? globalThis : {};
root.THREE = THREE;
root.FirstPersonControls = FirstPersonControls;
