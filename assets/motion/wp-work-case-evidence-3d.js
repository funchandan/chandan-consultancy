/**
 * Work case evidence 3D — MOTION-WORK-CASE-003 / WO-018 Tier 3
 */
(function () {
  "use strict";

  var WPM = window.WPMotion;
  if (!WPM || typeof WPM.register !== "function") return;

  var THREE = window.THREE;

  function prefersReducedMotion() {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function readVar(el, name, fallback) {
    var v = getComputedStyle(el).getPropertyValue(name).trim();
    return v || fallback;
  }

  function parseNum(v, fallback) {
    var n = parseFloat(v);
    return isNaN(n) ? fallback : n;
  }

  function createEvidenceStage(mediaEl, caseEl) {
    var imgs = mediaEl.querySelectorAll(".wp-project-case__device img");
    if (!imgs.length) return null;

    var canvas = document.createElement("canvas");
    canvas.className = "wp-case-evidence-gl";
    canvas.setAttribute("aria-hidden", "true");
    mediaEl.insertBefore(canvas, mediaEl.firstChild);

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      if (!renderer.getContext()) {
        throw new Error("WebGL unavailable");
      }
    } catch (_webglErr) {
      canvas.remove();
      return null;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.z = 4.2;

    var root = new THREE.Group();
    scene.add(root);

    var planes = [];
    var loader = new THREE.TextureLoader();
    var disposed = false;
    var texturesLoaded = 0;
    var texturesErrored = 0;

    imgs.forEach(function (img, i) {
      img.classList.add("wp-case-evidence-gl-fallback");
      var tex = loader.load(
        img.currentSrc || img.src,
        function () {
          texturesLoaded += 1;
          maybeHideFallbacks();
        },
        undefined,
        function () {
          texturesErrored += 1;
          maybeHideFallbacks();
        }
      );
      if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
      else if (THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
      var mat = new THREE.MeshStandardMaterial({
        map: tex,
        transparent: true,
        roughness: 0.35,
        metalness: 0.12,
      });
      var geo = new THREE.PlaneGeometry(1.15, 2.05);
      var mesh = new THREE.Mesh(geo, mat);
      mesh.position.x = (i - (imgs.length - 1) / 2) * 1.35;
      mesh.position.z = -i * 0.15;
      root.add(mesh);
      planes.push({ mesh: mesh, mat: mat, geo: geo, tex: tex });
    });

    var light = new THREE.DirectionalLight(0xffffff, 1.1);
    light.position.set(2, 3, 4);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x8899bb, 0.55));

    var rim = new THREE.PointLight(0x144ccd, 0.85, 12);
    rim.position.set(-2, 1, 3);
    scene.add(rim);

    var tilt = { x: 0, y: 0 };
    var targetTilt = { x: 0, y: 0 };
    var rafId = 0;
    var paused = false;
    var rendered = false;

    function showFallbackImages() {
      imgs.forEach(function (img) {
        img.style.opacity = "";
        img.classList.remove("wp-case-evidence-gl-fallback");
      });
    }

    function teardownStage() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(rafId);
      mediaEl.removeEventListener("mousemove", onMove);
      mediaEl.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", resize);
      planes.forEach(function (p) {
        p.tex.dispose();
        p.mat.dispose();
        p.geo.dispose();
      });
      renderer.dispose();
      canvas.remove();
      showFallbackImages();
    }

    function maybeHideFallbacks() {
      if (rendered || disposed) return;
      if (texturesErrored > 0) {
        teardownStage();
        return;
      }
      if (texturesLoaded < imgs.length) return;
      rendered = true;
      imgs.forEach(function (img) {
        img.style.opacity = "0";
      });
    }

    function resize() {
      var w = mediaEl.clientWidth || 320;
      var h = mediaEl.clientHeight || 420;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }

    function readDepth() {
      var scale = parseNum(readVar(caseEl, "--case-media-scale", "1"), 1);
      var parallax = parseNum(readVar(caseEl, "--case-media-parallax", "0"), 0);
      var rotX = parseNum(readVar(caseEl, "--case-media-rotate", "0"), 0);
      return { scale: scale, parallax: parallax, rotX: rotX };
    }

    function frame() {
      if (disposed || paused) return;
      var d = readDepth();
      root.scale.setScalar(d.scale);
      root.position.y = d.parallax * 0.004;
      root.rotation.x = (d.rotX + tilt.x) * (Math.PI / 180);
      root.rotation.y = tilt.y * (Math.PI / 180);
      tilt.x += (targetTilt.x - tilt.x) * 0.12;
      tilt.y += (targetTilt.y - tilt.y) * 0.12;

      var lx = parseNum(
        getComputedStyle(document.documentElement).getPropertyValue("--hero-light-x"),
        68
      );
      var ly = parseNum(
        getComputedStyle(document.documentElement).getPropertyValue("--hero-light-y"),
        48
      );
      light.position.x = (lx / 50 - 1) * 3;
      light.position.y = (0.5 - ly / 100) * 3;

      try {
        renderer.render(scene, camera);
        maybeHideFallbacks();
      } catch (_renderErr) {
        teardownStage();
        return;
      }
      rafId = requestAnimationFrame(frame);
    }

    function onMove(e) {
      var r = mediaEl.getBoundingClientRect();
      var nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      var ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
      targetTilt.x = ny * -8;
      targetTilt.y = nx * 8;
    }

    function onLeave() {
      targetTilt.x = 0;
      targetTilt.y = 0;
    }

    mediaEl.addEventListener("mousemove", onMove);
    mediaEl.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", resize);
    resize();
    rafId = requestAnimationFrame(frame);

    return function destroy() {
      teardownStage();
    };
  }

  WPM.register("work-case-evidence-3d", {
    layer: 2,
    init: function (work, ctx) {
      if (!work || !THREE) return;

      var mediaBlocks = work.querySelectorAll(".wp-project-case__media");
      if (!mediaBlocks.length) return;

      work.classList.add("wp-work-evidence-3d");

      if ((ctx && ctx.reduced) || prefersReducedMotion()) return;

      var destroyers = [];
      mediaBlocks.forEach(function (media) {
        if (media.querySelector("[data-wp-iphone-frame]")) return;
        var caseEl = media.closest(".wp-project-case");
        var d = createEvidenceStage(media, caseEl);
        if (d) destroyers.push(d);
      });

      var paused = false;
      function onVis() {
        paused = document.hidden;
      }
      document.addEventListener("visibilitychange", onVis);

      return function destroy() {
        document.removeEventListener("visibilitychange", onVis);
        destroyers.forEach(function (fn) {
          fn();
        });
        work.classList.remove("wp-work-evidence-3d");
      };
    },
  });
})();
