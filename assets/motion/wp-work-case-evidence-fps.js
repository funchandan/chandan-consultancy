/**
 * Work case evidence FPS room — MOTION-WORK-CASE-FPS-001
 * Scene + camera + lighting + sequenced renderer with FirstPersonControls.
 */
(function () {
  "use strict";

  var WPM = window.WPMotion;
  if (!WPM || typeof WPM.register !== "function") return;

  var THREE = window.THREE;
  var FirstPersonControls = THREE && THREE.FirstPersonControls;

  function prefersReducedMotion() {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function setColorSpace(tex) {
    if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
    else if (THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
  }

  function createRoomScene(imgs) {
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0x08090d);
    scene.fog = new THREE.Fog(0x08090d, 6, 18);

    var disposables = [];
    var roomW = 9;
    var roomD = 9;
    var roomH = 4.2;

    function addMesh(geo, mat, pos, rot) {
      var mesh = new THREE.Mesh(geo, mat);
      if (pos) mesh.position.copy(pos);
      if (rot) mesh.rotation.copy(rot);
      scene.add(mesh);
      disposables.push({ geo: geo, mat: mat, tex: mat.map || null });
      return mesh;
    }

    var floorMat = new THREE.MeshStandardMaterial({
      color: 0x10141c,
      roughness: 0.92,
      metalness: 0.04,
    });
    addMesh(
      new THREE.PlaneGeometry(roomW, roomD),
      floorMat,
      new THREE.Vector3(0, 0, 0),
      new THREE.Euler(-Math.PI / 2, 0, 0)
    );

    var wallMat = new THREE.MeshStandardMaterial({
      color: 0x0c1018,
      roughness: 0.88,
      metalness: 0.06,
    });

    addMesh(
      new THREE.PlaneGeometry(roomW, roomH),
      wallMat,
      new THREE.Vector3(0, roomH / 2, -roomD / 2),
      new THREE.Euler(0, 0, 0)
    );
    addMesh(
      new THREE.PlaneGeometry(roomD, roomH),
      wallMat,
      new THREE.Vector3(-roomW / 2, roomH / 2, 0),
      new THREE.Euler(0, Math.PI / 2, 0)
    );
    addMesh(
      new THREE.PlaneGeometry(roomD, roomH),
      wallMat,
      new THREE.Vector3(roomW / 2, roomH / 2, 0),
      new THREE.Euler(0, -Math.PI / 2, 0)
    );

    var loader = new THREE.TextureLoader();
    var count = Math.min(imgs.length, 3);
    var spacing = 2.4;
    var startX = -((count - 1) * spacing) / 2;

    for (var i = 0; i < count; i++) {
      var img = imgs[i];
      var tex = loader.load(img.currentSrc || img.src);
      setColorSpace(tex);
      var evidenceMat = new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.35,
        metalness: 0.1,
        emissive: 0x050608,
        emissiveIntensity: 0.15,
      });
      var frameGeo = new THREE.PlaneGeometry(1.35, 2.35);
      addMesh(
        frameGeo,
        evidenceMat,
        new THREE.Vector3(startX + i * spacing, 1.75, -roomD / 2 + 0.04),
        new THREE.Euler(0, 0, 0)
      );
    }

    var ambient = new THREE.AmbientLight(0x8899bb, 0.48);
    scene.add(ambient);

    var key = new THREE.DirectionalLight(0xffffff, 1.05);
    key.position.set(2.5, 5.5, 4);
    scene.add(key);

    var fill = new THREE.DirectionalLight(0xaabbdd, 0.35);
    fill.position.set(-3, 2.5, 2);
    scene.add(fill);

    var rim = new THREE.PointLight(0x144ccd, 0.85, 16);
    rim.position.set(-2.5, 2.2, 1.5);
    scene.add(rim);

    var camera = new THREE.PerspectiveCamera(62, 1, 0.08, 40);
    camera.position.set(0, 1.65, roomD * 0.28);

    function dispose() {
      disposables.forEach(function (item) {
        if (item.tex) item.tex.dispose();
        item.mat.dispose();
        item.geo.dispose();
      });
    }

    return { scene: scene, camera: camera, dispose: dispose };
  }

  function createRenderer(canvas) {
    var renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x08090d, 1);
    if (renderer.outputColorSpace !== undefined) {
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    } else if (renderer.outputEncoding !== undefined) {
      renderer.outputEncoding = THREE.sRGBEncoding;
    }
    return renderer;
  }

  function createRenderSequence(renderer, scene, camera, controls, ctx) {
    var clock = new THREE.Clock();
    var rafId = 0;
    var running = false;
    var disposed = false;

    function tick() {
      if (disposed) return;
      rafId = requestAnimationFrame(tick);
      if (!running || (ctx && ctx.paused) || document.hidden) return;

      var delta = Math.min(clock.getDelta(), 0.05);
      controls.update(delta);
      renderer.render(scene, camera);
    }

    return {
      start: function () {
        if (disposed) return;
        running = true;
        clock.start();
        if (!rafId) rafId = requestAnimationFrame(tick);
      },
      stop: function () {
        running = false;
        clock.stop();
      },
      resize: function (w, h) {
        if (w < 1 || h < 1) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      },
      dispose: function () {
        disposed = true;
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
        renderer.dispose();
      },
    };
  }

  function mountFpsOverlay(mediaEl, imgs, ctx) {
    var overlay = document.createElement("div");
    overlay.className = "wp-case-fps";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Explore case evidence in 3D");
    overlay.hidden = true;

    var hud = document.createElement("div");
    hud.className = "wp-case-fps__hud";
    hud.innerHTML =
      '<p class="wp-case-fps__hint">Drag to look · WASD to move · Esc to exit</p>' +
      '<button type="button" class="wp-case-fps__exit">Exit</button>';

    var canvas = document.createElement("canvas");
    canvas.className = "wp-case-fps__canvas";

    overlay.appendChild(canvas);
    overlay.appendChild(hud);
    document.body.appendChild(overlay);

    var room = null;
    var renderer = null;
    var controls = null;
    var sequence = null;
    var active = false;

    function teardown() {
      active = false;
      overlay.hidden = true;
      document.body.classList.remove("wp-case-fps-open");
      if (controls) {
        controls.enabled = false;
        controls.dispose();
        controls = null;
      }
      if (sequence) {
        sequence.dispose();
        sequence = null;
      }
      if (room) {
        room.dispose();
        room = null;
      }
      renderer = null;
    }

    function onKeyDown(e) {
      if (!active) return;
      if (e.key === "Escape") {
        e.preventDefault();
        teardown();
      }
    }

    function open() {
      if (active || !FirstPersonControls) return;
      teardown();

      room = createRoomScene(imgs);
      renderer = createRenderer(canvas);
      controls = new FirstPersonControls(room.camera, canvas);
      controls.movementSpeed = 3.2;
      controls.lookSpeed = 0.18;
      controls.lookVertical = true;

      sequence = createRenderSequence(
        renderer,
        room.scene,
        room.camera,
        controls,
        ctx
      );
      sequence.resize(window.innerWidth, window.innerHeight);

      overlay.hidden = false;
      document.body.classList.add("wp-case-fps-open");
      controls.enabled = true;
      active = true;
      sequence.start();
      hud.querySelector(".wp-case-fps__exit").focus();
    }

    function onResize() {
      if (sequence) sequence.resize(window.innerWidth, window.innerHeight);
    }

    hud.querySelector(".wp-case-fps__exit").addEventListener("click", teardown);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    return {
      open: open,
      destroy: function () {
        teardown();
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("resize", onResize);
        overlay.remove();
      },
    };
  }

  WPM.register("work-case-evidence-fps", {
    layer: 3,
    init: function (work, ctx) {
      if (!work || !THREE || !FirstPersonControls) return;
      if ((ctx && ctx.reduced) || prefersReducedMotion()) return;

      var mediaBlocks = work.querySelectorAll(".wp-project-case__media");
      if (!mediaBlocks.length) return;

      work.classList.add("wp-work-evidence-fps");

      var instances = [];

      mediaBlocks.forEach(function (media) {
        var imgs = media.querySelectorAll(".wp-project-case__device img");
        if (!imgs.length) return;

        var enter = document.createElement("button");
        enter.type = "button";
        enter.className = "wp-case-fps__enter";
        enter.textContent = "Step inside";
        enter.setAttribute(
          "aria-label",
          "Explore case evidence in first-person 3D"
        );
        media.appendChild(enter);

        var fps = mountFpsOverlay(media, imgs, ctx);
        enter.addEventListener("click", fps.open);
        instances.push({ enter: enter, fps: fps });
      });

      return function destroy() {
        instances.forEach(function (item) {
          item.fps.destroy();
          item.enter.remove();
        });
        work.classList.remove("wp-work-evidence-fps");
      };
    },
  });
})();
