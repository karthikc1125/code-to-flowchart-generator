import React, { useRef, useEffect, useState } from 'react';
import { FiEye, FiDownload } from 'react-icons/fi';
import mermaid from 'mermaid';
import { jsPDF } from 'jspdf';
import { Canvg } from 'canvg';
import styles from '../styles/MermaidEditor.module.css';

interface DiagramPreviewProps {
  code: string;
  isLoading?: boolean;
  shouldRender: boolean;
}

const DiagramPreview: React.FC<DiagramPreviewProps> = ({ code, isLoading = false, shouldRender }) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  useEffect(() => {
    // Initialize mermaid with proper configuration to hide version info
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis'
      },
      // Reduce logging
      logLevel: 3,
      // Suppress error rendering
      suppressErrorRendering: true
    });
  }, []);

  useEffect(() => {
    const renderDiagram = async () => {
      if (previewRef.current && !isLoading && shouldRender && code.trim()) {
        try {
          previewRef.current.innerHTML = '';
          
          // Create a unique ID for each diagram to avoid conflicts
          const uniqueId = `mermaid-${Date.now()}`;
          
          // Use mermaid.render instead of init for better control
          const { svg } = await mermaid.render(uniqueId + '-svg', code);
          previewRef.current.innerHTML = svg;
          
          console.log('Mermaid diagram rendered successfully');
        } catch (err: any) {
          const errorMessage = err?.message || err?.toString() || 'Error rendering diagram';
          console.error('Mermaid rendering failed:', errorMessage);
          if (previewRef.current) {
            previewRef.current.innerHTML = `<div style="color: #ef4444; padding: 20px; text-align: center; font-size: 14px;">⚠️ ${errorMessage}</div>`;
          }
        }
      }
    };
    
    renderDiagram();
  }, [code, isLoading, shouldRender]);

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showExportMenu && !(event.target as Element).closest('[data-export-menu]')) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showExportMenu]);

  const exportDiagram = async (format: 'svg' | 'png' | 'jpg' | 'jpeg' | 'pdf') => {
    if (!shouldRender || !previewRef.current) return;

    console.log('Starting export for format:', format);

    try {
      // Use the already-rendered SVG from the preview to ensure WYSIWYG export
      const liveSvg = previewRef.current.querySelector('svg') as SVGSVGElement | null;
      if (!liveSvg) throw new Error('No SVG found in preview');
      let svgData = new XMLSerializer().serializeToString(liveSvg);

      // Measure true bounds from live SVG contents
      let bboxWidth: number | undefined;
      let bboxHeight: number | undefined;
      let bboxX = 0;
      let bboxY = 0;
      try {
        const g = liveSvg.querySelector('g') as SVGGElement | null;
        const target: any = g || (liveSvg as any);
        if (target && typeof target.getBBox === 'function') {
          const bbox = target.getBBox();
          bboxWidth = bbox.width;
          bboxHeight = bbox.height;
          bboxX = bbox.x;
          bboxY = bbox.y;
        }
      } catch {}

      // Normalize the opening <svg> tag to avoid duplicate width/height attrs
      // Prefer measured bbox; fallback to any existing width/height/viewBox
      const widthAttrMatch = svgData.match(/\bwidth\s*=\s*"(\d+(?:\.\d+)?)\s*(?:px)?"/i);
      const heightAttrMatch = svgData.match(/\bheight\s*=\s*"(\d+(?:\.\d+)?)\s*(?:px)?"/i);
      const viewBoxMatch = svgData.match(/\bviewBox\s*=\s*"([\d\.\s-]+)"/i);
      let baseWidth: number | undefined;
      let baseHeight: number | undefined;
      if (widthAttrMatch && heightAttrMatch) {
        baseWidth = parseFloat(widthAttrMatch[1]);
        baseHeight = parseFloat(heightAttrMatch[1]);
      } else if (viewBoxMatch) {
        const parts = viewBoxMatch[1].trim().split(/\s+/).map(Number);
        if (parts.length === 4) { baseWidth = parts[2]; baseHeight = parts[3]; }
      }
      const finalW = (bboxWidth || baseWidth || 800);
      const finalH = (bboxHeight || baseHeight || 600);
      const finalVB = (bboxWidth && bboxHeight)
        ? `${bboxX} ${bboxY} ${bboxWidth} ${bboxHeight}`
        : (viewBoxMatch ? viewBoxMatch[1] : `0 0 ${finalW} ${finalH}`);
      // Replace the opening tag entirely with a clean one to prevent redefined attributes
      svgData = svgData.replace(/<svg[^>]*>/i,
        `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${finalW}" height="${finalH}" viewBox="${finalVB}" preserveAspectRatio="xMidYMid meet">` +
        `<rect x="${bboxX}" y="${bboxY}" width="${bboxWidth || finalW}" height="${bboxHeight || finalH}" fill="#ffffff" />`
      );

      if (format === 'svg') {
        // Export as SVG - save rendered string
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        
        const downloadLink = document.createElement('a');
        downloadLink.href = svgUrl;
        downloadLink.download = 'diagram.svg';
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        setTimeout(() => URL.revokeObjectURL(svgUrl), 100);
        console.log('SVG export completed');
      } else if (format === 'png' || format === 'jpg' || format === 'jpeg') {
        // Rasterize via canvg using measured bbox
        const tmp = document.createElement('div');
        tmp.innerHTML = svgData;
        const svgEl = tmp.querySelector('svg') as SVGSVGElement | null;
        if (!svgEl) throw new Error('Rendered SVG not found');
        const wAttr = svgEl.getAttribute('width');
        const hAttr = svgEl.getAttribute('height');
        let w = (wAttr ? parseFloat(wAttr) : undefined) || bboxWidth || 800;
        let h = (hAttr ? parseFloat(hAttr) : undefined) || bboxHeight || 600;
        const scaleCanvas = 3;
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(w * scaleCanvas));
        canvas.height = Math.max(1, Math.round(h * scaleCanvas));
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas 2D context not available');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const v = await Canvg.from(ctx, svgData, { ignoreAnimation: true, ignoreMouse: true });
        await v.render();
        const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
        const quality = format === 'png' ? 1.0 : 0.92;
        const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, mimeType, quality));
        if (!blob) throw new Error('Failed to generate image');
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `diagram.${format}`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 200);
        console.log(`${format.toUpperCase()} export completed`);
      } else if (format === 'pdf') {
        // Rasterize via canvg (stable across environments) then embed into PDF
        const tmp = document.createElement('div');
        tmp.innerHTML = svgData;
        const svgEl = tmp.querySelector('svg') as SVGSVGElement | null;
        if (!svgEl) throw new Error('Rendered SVG not found');

        const wAttr = svgEl.getAttribute('width');
        const hAttr = svgEl.getAttribute('height');
        let w = (wAttr ? parseFloat(wAttr) : undefined) || 800;
        let h = (hAttr ? parseFloat(hAttr) : undefined) || 600;
        const vb = svgEl.getAttribute('viewBox');
        if ((!w || !h) && vb) {
          const p = vb.split(/\s+/).map(Number);
          if (p.length === 4) { w = p[2]; h = p[3]; }
        }

        const scaleCanvas = 2;
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(w * scaleCanvas));
        canvas.height = Math.max(1, Math.round(h * scaleCanvas));
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas 2D context not available');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const v = await Canvg.from(ctx, svgData, { ignoreAnimation: true, ignoreMouse: true });
        await v.render();

        // Create PDF with proper orientation
        const orientation = w > h ? 'landscape' : 'portrait';
        const pdf = new jsPDF({ orientation, unit: 'mm', format: 'a4' });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 10;
        const maxW = pageWidth - margin * 2;
        const maxH = pageHeight - margin * 2;
        const scale = Math.min(maxW / w, maxH / h);
        const drawW = w * scale;
        const drawH = h * scale;
        const offsetX = (pageWidth - drawW) / 2;
        const offsetY = (pageHeight - drawH) / 2;

        const imgData = canvas.toDataURL('image/png', 1.0);
        pdf.addImage(imgData, 'PNG', offsetX, offsetY, drawW, drawH);
        pdf.save('diagram.pdf');
        console.log('PDF export completed');
      }
    } catch (error) {
      const message = (error && (error as any).message) ? (error as any).message : String(error);
      console.error('Export failed:', error);
      alert(`Export failed: ${message}`);
    }
  };

  return (
    <div className={styles.previewSection}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 className={styles.sectionTitle}>
          <FiEye size={24} />
          Preview
        </h2>
                 <div style={{ position: 'relative' }} data-export-menu>
             <button
               onClick={() => setShowExportMenu(!showExportMenu)}
               disabled={!shouldRender}
               style={{
                 display: 'flex',
                 alignItems: 'center',
                 gap: '8px',
                 padding: '8px 16px',
                 backgroundColor: shouldRender ? '#3b82f6' : '#9ca3af',
                 color: 'white',
                 border: 'none',
                 borderRadius: '6px',
                 cursor: shouldRender ? 'pointer' : 'not-allowed',
                 fontSize: '14px',
                 fontWeight: '500',
                 minWidth: '120px',
                 justifyContent: 'center',
                 opacity: shouldRender ? 1 : 0.6
               }}
             >
               <FiDownload size={16} />
               Export
             </button>
            {showExportMenu && shouldRender && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '4px',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                zIndex: 10,
                minWidth: '140px'
              }}>
                <button
                  onClick={() => { exportDiagram('svg'); setShowExportMenu(false); }}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  SVG
                </button>
                <button
                  onClick={() => { exportDiagram('png'); setShowExportMenu(false); }}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  PNG
                </button>
                <button
                  onClick={() => { exportDiagram('jpg'); setShowExportMenu(false); }}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  JPG
                </button>
                <button
                  onClick={() => { exportDiagram('pdf'); setShowExportMenu(false); }}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  PDF
                </button>
              </div>
            )}
          </div>
      </div>
      <div className={styles.previewWrapper}>
        {isLoading ? (
          <div className={styles.loadingSpinner} />
        ) : !shouldRender ? (
          <div style={{ color: '#9ca3af', fontSize: 14, textAlign: 'center' }}>Click "Render Diagram" to preview</div>
        ) : (
          <div ref={previewRef} />
        )}
      </div>
    </div>
  );
};

export default DiagramPreview;