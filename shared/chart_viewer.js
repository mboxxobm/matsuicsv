(function () {
  if (window.__chartViewerInstalled) return;
  window.__chartViewerInstalled = true;

  var images = [];
  var index = 0;
  var rotation = 0;
  var scale = 1;
  var overlay;
  var stage;
  var canvas;
  var viewerImage;
  var meta;
  var caption;
  var startX = 0;
  var startY = 0;
  var dragState = null;
  var pinchState = null;
  var touchPanState = null;
  var touchStart = null;
  var MIN_SCALE = 1;
  var MAX_SCALE = 4;
  var SCALE_STEP = 0.25;

  function isUsableImage(img) {
    if (!img || !img.src) return false;
    if (!img.getAttribute('src')) return false;
    if (img.closest('.chart-viewer-overlay')) return false;
    if (img.closest('.lightbox')) return false;
    if (/^(lbImg|lightboxImage)$/i.test(img.id || '')) return false;
    if (img.naturalWidth === 1 && img.naturalHeight === 1) return false;
    return true;
  }

  function collectImages() {
    images = Array.prototype.slice.call(document.images).filter(isUsableImage);
    images.forEach(function (img) {
      img.setAttribute('data-chart-viewer-ready', 'true');
      img.setAttribute('title', img.getAttribute('title') || 'クリックで拡大');
      img.setAttribute('tabindex', img.getAttribute('tabindex') || '0');
      if (img.__chartViewerClickBound) return;
      img.__chartViewerClickBound = true;
      img.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        collectImages();
        openAt(images.indexOf(img));
      }, true);
      img.addEventListener('keydown', function (event) {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        collectImages();
        openAt(images.indexOf(img));
      });
    });
  }

  function clampScale(value) {
    return Math.max(MIN_SCALE, Math.min(MAX_SCALE, value));
  }

  function touchDistance(first, second) {
    var dx = second.clientX - first.clientX;
    var dy = second.clientY - first.clientY;
    return Math.max(1, Math.sqrt(dx * dx + dy * dy));
  }

  function touchMidpoint(first, second) {
    return {
      clientX: (first.clientX + second.clientX) / 2,
      clientY: (first.clientY + second.clientY) / 2
    };
  }

  function getStagePoint(clientX, clientY) {
    var rect = stage.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function canvasCenter() {
    return {
      x: canvas.offsetLeft + canvas.offsetWidth / 2,
      y: canvas.offsetTop + canvas.offsetHeight / 2
    };
  }

  function clampScroll(value, maximum) {
    return Math.max(0, Math.min(Math.max(0, maximum), value));
  }

  function beginPinch(event) {
    if (!event.touches || event.touches.length < 2) return;
    var first = event.touches[0];
    var second = event.touches[1];
    var midpoint = touchMidpoint(first, second);
    var point = getStagePoint(midpoint.clientX, midpoint.clientY);
    var center = canvasCenter();
    pinchState = {
      startDistance: touchDistance(first, second),
      startScale: scale,
      startScrollLeft: stage.scrollLeft,
      startScrollTop: stage.scrollTop,
      startPointX: point.x,
      startPointY: point.y,
      startCenterX: center.x,
      startCenterY: center.y,
      moved: false
    };
    touchPanState = null;
    touchStart = { x: midpoint.clientX, y: midpoint.clientY, hadPinch: true };
    viewerImage.classList.add('is-pinch-zooming');
    event.preventDefault();
  }

  function updatePinch(event) {
    if (!pinchState || !event.touches || event.touches.length < 2) return;
    var first = event.touches[0];
    var second = event.touches[1];
    var midpoint = touchMidpoint(first, second);
    var point = getStagePoint(midpoint.clientX, midpoint.clientY);
    var nextScale = clampScale(pinchState.startScale * touchDistance(first, second) / pinchState.startDistance);
    var imagePointX = (pinchState.startScrollLeft + pinchState.startPointX - pinchState.startCenterX) / pinchState.startScale;
    var imagePointY = (pinchState.startScrollTop + pinchState.startPointY - pinchState.startCenterY) / pinchState.startScale;
    scale = Math.round(nextScale * 100) / 100;
    pinchState.moved = true;
    updateCaption();
    renderView();
    var center = canvasCenter();
    var maximumLeft = Math.max(0, stage.scrollWidth - stage.clientWidth);
    var maximumTop = Math.max(0, stage.scrollHeight - stage.clientHeight);
    stage.scrollLeft = clampScroll(center.x + imagePointX * scale - point.x, maximumLeft);
    stage.scrollTop = clampScroll(center.y + imagePointY * scale - point.y, maximumTop);
    event.preventDefault();
  }

  function finishTouchGesture() {
    pinchState = null;
    touchPanState = null;
    touchStart = null;
    if (viewerImage) viewerImage.classList.remove('is-pinch-zooming');
  }

  function buildOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'chart-viewer-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = [
      '<div class="chart-viewer-toolbar">',
      '<span class="chart-viewer-gesture-hint">スマホ：2本指で拡大・縮小／1本指で移動</span>',
      '<button class="chart-viewer-button" type="button" data-action="zoom-out">縮小</button>',
      '<button class="chart-viewer-button" type="button" data-action="zoom-in">拡大</button>',
      '<button class="chart-viewer-button" type="button" data-action="landscape">横表示</button>',
      '<button class="chart-viewer-button" type="button" data-action="rotate-left">左回転</button>',
      '<button class="chart-viewer-button" type="button" data-action="rotate-right">右回転</button>',
      '<button class="chart-viewer-button" type="button" data-action="reset">戻す</button>',
      '<button class="chart-viewer-button" type="button" data-action="close">閉じる</button>',
      '</div>',
      '<div class="chart-viewer-meta"></div>',
      '<button class="chart-viewer-button chart-viewer-nav chart-viewer-prev" type="button" data-action="prev" aria-label="前の画像">‹</button>',
      '<div class="chart-viewer-stage"><div class="chart-viewer-canvas"><img class="chart-viewer-image" alt="" draggable="false"></div></div>',
      '<button class="chart-viewer-button chart-viewer-nav chart-viewer-next" type="button" data-action="next" aria-label="次の画像">›</button>',
      '<div class="chart-viewer-caption"></div>'
    ].join('');
    document.body.appendChild(overlay);
    stage = overlay.querySelector('.chart-viewer-stage');
    canvas = overlay.querySelector('.chart-viewer-canvas');
    viewerImage = overlay.querySelector('.chart-viewer-image');
    meta = overlay.querySelector('.chart-viewer-meta');
    caption = overlay.querySelector('.chart-viewer-caption');

    overlay.addEventListener('click', function (event) {
      var action = event.target && event.target.getAttribute('data-action');
      if (event.target === overlay) close();
      if (!action) return;
      if (action === 'close') close();
      if (action === 'prev') move(-1);
      if (action === 'next') move(1);
      if (action === 'zoom-out') zoomBy(-SCALE_STEP);
      if (action === 'zoom-in') zoomBy(SCALE_STEP);
      if (action === 'landscape') setLandscape();
      if (action === 'rotate-left') rotate(-90);
      if (action === 'rotate-right') rotate(90);
      if (action === 'reset') {
        resetView();
        updateCaption();
        renderView();
      }
    });
    viewerImage.addEventListener('dblclick', function (event) {
      event.preventDefault();
      if (scale > MIN_SCALE) {
        resetView();
        updateCaption();
        renderView();
        return;
      }
      scale = 2;
      updateCaption();
      renderView();
    });
    viewerImage.addEventListener('load', function () {
      renderView();
    });
    overlay.addEventListener('wheel', function (event) {
      if (!overlay.classList.contains('is-open')) return;
      var modifierZoom = event.ctrlKey || event.metaKey;
      var horizontalScroll = Math.abs(event.deltaX) > Math.abs(event.deltaY);
      // At the default size, the wheel enlarges the chart. Once enlarged,
      // the wheel is left to the scroll stage so the chart can be panned.
      // Ctrl/Cmd + wheel always remains an explicit zoom gesture.
      if (!modifierZoom && (scale > MIN_SCALE || horizontalScroll)) return;
      event.preventDefault();
      zoomBy(event.deltaY < 0 ? SCALE_STEP : -SCALE_STEP);
    }, { passive: false });
    stage.addEventListener('pointerdown', function (event) {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      if (stage.scrollWidth <= stage.clientWidth + 2 && stage.scrollHeight <= stage.clientHeight + 2) return;
      dragState = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        scrollLeft: stage.scrollLeft,
        scrollTop: stage.scrollTop,
        moved: false
      };
      stage.classList.add('is-dragging');
      stage.setPointerCapture(event.pointerId);
      event.preventDefault();
    });
    stage.addEventListener('pointermove', function (event) {
      if (!dragState || event.pointerId !== dragState.pointerId) return;
      var diffX = event.clientX - dragState.startX;
      var diffY = event.clientY - dragState.startY;
      if (!dragState.moved && Math.abs(diffX) < 2 && Math.abs(diffY) < 2) return;
      dragState.moved = true;
      stage.scrollLeft = dragState.scrollLeft - diffX;
      stage.scrollTop = dragState.scrollTop - diffY;
      event.preventDefault();
    }, { passive: false });
    function finishDrag(event) {
      if (!dragState || (event.pointerId !== undefined && event.pointerId !== dragState.pointerId)) return;
      var pointerId = dragState.pointerId;
      dragState = null;
      stage.classList.remove('is-dragging');
      if (stage.hasPointerCapture && stage.hasPointerCapture(pointerId)) stage.releasePointerCapture(pointerId);
    }
    stage.addEventListener('pointerup', finishDrag);
    stage.addEventListener('pointercancel', finishDrag);
    stage.addEventListener('lostpointercapture', finishDrag);
    stage.addEventListener('touchstart', function (event) {
      if (!event.touches || !event.touches.length) return;
      if (event.touches.length >= 2) {
        beginPinch(event);
        return;
      }
      if (pinchState) return;
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
      if (scale > MIN_SCALE || Math.abs(rotation % 180) === 90) {
        touchPanState = {
          startX: startX,
          startY: startY,
          scrollLeft: stage.scrollLeft,
          scrollTop: stage.scrollTop,
          moved: false
        };
      } else {
        touchPanState = null;
      }
    }, { passive: false });
    stage.addEventListener('touchmove', function (event) {
      if (!event.touches || !event.touches.length) return;
      if (event.touches.length >= 2) {
        if (!pinchState) beginPinch(event);
        updatePinch(event);
        return;
      }
      if (pinchState || !touchPanState || event.touches.length !== 1) return;
      var diffX = event.touches[0].clientX - touchPanState.startX;
      var diffY = event.touches[0].clientY - touchPanState.startY;
      if (!touchPanState.moved && Math.abs(diffX) < 2 && Math.abs(diffY) < 2) return;
      touchPanState.moved = true;
      stage.scrollLeft = touchPanState.scrollLeft - diffX;
      stage.scrollTop = touchPanState.scrollTop - diffY;
      event.preventDefault();
    }, { passive: false });
    stage.addEventListener('touchend', function (event) {
      if (!event.touches || !event.touches.length) {
        if (pinchState) finishTouchGesture();
        else touchPanState = null;
      }
    }, { passive: false });
    stage.addEventListener('touchcancel', finishTouchGesture, { passive: false });
    overlay.addEventListener('touchstart', function (event) {
      if (!event.touches || !event.touches.length) return;
      if (event.touches.length >= 2) {
        touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY, hadPinch: true };
        return;
      }
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
      touchStart = { x: startX, y: startY, hadPinch: false };
    }, { passive: true });
    overlay.addEventListener('touchend', function (event) {
      if (!event.changedTouches || !event.changedTouches.length || !touchStart) return;
      if (touchStart.hadPinch || (event.touches && event.touches.length)) {
        if (!event.touches || !event.touches.length) touchStart = null;
        return;
      }
      var diff = event.changedTouches[0].clientX - touchStart.x;
      var diffY = event.changedTouches[0].clientY - touchStart.y;
      touchStart = null;
      if (Math.abs(diff) <= Math.abs(diffY)) return;
      if (scale > MIN_SCALE || Math.abs(rotation % 180) === 90) {
        var atLeft = !stage || stage.scrollLeft <= 2;
        var atRight = !stage || stage.scrollLeft + stage.clientWidth >= stage.scrollWidth - 2;
        if (diff > 48 && atLeft) move(-1);
        if (diff < -48 && atRight) move(1);
        return;
      }
      if (Math.abs(diff) < 48) return;
      move(diff > 0 ? -1 : 1);
    }, { passive: true });
  }

  function openAt(nextIndex) {
    if (!overlay) buildOverlay();
    if (!images.length) return;
    index = nextIndex >= 0 ? nextIndex : 0;
    resetView();
    render();
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
    renderView();
    if (window.requestAnimationFrame) window.requestAnimationFrame(renderView);
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    viewerImage.removeAttribute('src');
    dragState = null;
    finishTouchGesture();
    if (stage) stage.classList.remove('is-pannable', 'is-dragging');
    if (canvas) {
      canvas.style.width = '';
      canvas.style.height = '';
    }
    document.documentElement.style.overflow = '';
  }

  function move(delta) {
    if (!images.length) return;
    index = (index + delta + images.length) % images.length;
    resetView();
    render();
  }

  function setLandscape() {
    var source = images[index];
    if (!source) return;
    var portrait = (source.naturalHeight || source.height) > (source.naturalWidth || source.width);
    rotation = portrait ? 90 : 0;
    overlay.classList.add('is-wide');
    renderView();
  }

  function rotate(delta) {
    rotation = (rotation + delta) % 360;
    renderView();
  }

  function zoomBy(delta) {
    scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, Math.round((scale + delta) * 100) / 100));
    updateCaption();
    renderView();
  }

  function resetView() {
    rotation = 0;
    scale = 1;
    if (stage) {
      stage.scrollLeft = 0;
      stage.scrollTop = 0;
    }
  }

  function renderView() {
    viewerImage.style.transform = 'scale(' + scale + ') rotate(' + rotation + 'deg)';
    viewerImage.classList.toggle('is-landscape', Math.abs(rotation % 180) === 90);
    viewerImage.classList.toggle('is-zoomed', scale > MIN_SCALE);
    syncCanvasSize();
  }

  function syncCanvasSize() {
    if (!canvas || !viewerImage || !stage) return;
    var imageWidth = viewerImage.offsetWidth;
    var imageHeight = viewerImage.offsetHeight;
    if (!imageWidth || !imageHeight) return;
    var rotated = Math.abs(rotation % 180) === 90;
    var contentWidth = (rotated ? imageHeight : imageWidth) * scale + 4;
    var contentHeight = (rotated ? imageWidth : imageHeight) * scale + 4;
    var availableWidth = Math.max(0, stage.clientWidth - 24);
    var availableHeight = Math.max(0, stage.clientHeight - 24);
    canvas.style.width = Math.max(availableWidth, contentWidth) + 'px';
    canvas.style.height = Math.max(availableHeight, contentHeight) + 'px';
    stage.classList.toggle('is-pannable', stage.scrollWidth > stage.clientWidth + 2 || stage.scrollHeight > stage.clientHeight + 2);
  }

  function escapeHtml(text) {
    return String(text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function buildMetaHtml(source, figcaption) {
    if (!meta) return '';
    var explicit = source.getAttribute('data-chart-viewer-meta');
    if (explicit) return explicit;

    var raw = ((figcaption && figcaption.textContent) || source.alt || '').trim();
    if (!raw) return '';

    var parts = raw.split('/').map(function (part) {
      return part.trim();
    }).filter(Boolean);
    if (!parts.length) return '';

    var rows = [];
    if (parts[0]) {
      rows.push('<span class="chart-viewer-meta-chip"><strong>銘柄</strong><span>' + escapeHtml(parts[0]) + '</span></span>');
    }
    if (parts[1]) {
      rows.push('<span class="chart-viewer-meta-chip"><strong>分類</strong><span>' + escapeHtml(parts[1]) + '</span></span>');
    }
    if (parts.length > 2) {
      rows.push('<span class="chart-viewer-meta-chip"><strong>タグ</strong><span>' + escapeHtml(parts.slice(2).join(' / ')) + '</span></span>');
    }
    if (!rows.length) {
      rows.push('<span class="chart-viewer-meta-chip"><strong>詳細メモ</strong><span>' + escapeHtml(raw) + '</span></span>');
    }
    return rows.join('');
  }

  function updateCaption() {
    var source = images[index];
    if (!source) return;
    var figcaption = source.closest('figure') && source.closest('figure').querySelector('figcaption');
    var text = (figcaption && figcaption.textContent) || source.alt || source.getAttribute('src') || '';
    if (meta) {
      meta.innerHTML = buildMetaHtml(source, figcaption);
      meta.classList.toggle('is-empty', !meta.innerHTML.trim());
    }
    caption.textContent = (index + 1) + ' / ' + images.length + '  x' + scale.toFixed(2).replace(/\.00$/, '') + '  ' + text;
  }

  function render() {
    var source = images[index];
    if (!source) return;
    viewerImage.src = source.currentSrc || source.src;
    viewerImage.alt = source.alt || '';
    updateCaption();
    if (overlay) overlay.classList.remove('is-wide');
    renderView();
  }

  document.addEventListener('keydown', function (event) {
    if (!overlay || !overlay.classList.contains('is-open')) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
    if (event.key === '+' || event.key === '=') zoomBy(SCALE_STEP);
    if (event.key === '-') zoomBy(-SCALE_STEP);
    if (event.key === '0') { resetView(); updateCaption(); renderView(); }
    if (event.key === 'r' || event.key === 'R') rotate(90);
    if (event.key === 'l' || event.key === 'L') setLandscape();
  });

  document.addEventListener('click', function (event) {
    var target = event.target && event.target.closest && event.target.closest('img');
    if (!target || !isUsableImage(target)) return;
    event.preventDefault();
    collectImages();
    openAt(images.indexOf(target));
  }, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', collectImages);
  } else {
    collectImages();
  }
  window.addEventListener('load', collectImages);
  window.addEventListener('pageshow', collectImages);
  window.addEventListener('resize', function () {
    if (overlay && overlay.classList.contains('is-open')) syncCanvasSize();
  });
  window.refreshChartViewer = collectImages;
  var observer = new MutationObserver(function (mutations) {
    for (var i = 0; i < mutations.length; i += 1) {
      if (mutations[i].addedNodes && mutations[i].addedNodes.length) {
        collectImages();
        break;
      }
    }
  });
  if (document.documentElement) {
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }
})();
