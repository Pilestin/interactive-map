// This file manages the drawing controls for the map, allowing users to select between different drawing modes, colors, and line styles.

document.addEventListener('DOMContentLoaded', function() {
    const colorPicker = document.getElementById('color-picker');
    const lineStyleSelector = document.getElementById('line-style');
    const lineWidthSlider = document.getElementById('line-width');
    const widthValueDisplay = document.getElementById('width-value');
    
    const pointModeBtn = document.getElementById('point-mode');
    const routeModeBtn = document.getElementById('route-mode');
    const clearAllBtn = document.getElementById('clear-all');
    const saveRoutesBtn = document.getElementById('save-routes');
    const undoBtn = document.getElementById('undo-btn');

    let currentMode = null;

    // Initialize controls
    if (widthValueDisplay && lineWidthSlider) {
        widthValueDisplay.textContent = lineWidthSlider.value;
    }

    // Color picker change event
    if (colorPicker) {
        colorPicker.addEventListener('input', function() {
            console.log('Color changed to:', colorPicker.value);
            // Sadece yeni çizimler için renk değişir
        });
    }

    // Line style change event
    if (lineStyleSelector) {
        lineStyleSelector.addEventListener('change', function() {
            console.log('Line style changed to:', lineStyleSelector.value);
            // Sadece yeni çizimler için stil değişir
        });
    }

    // Line width change event
    if (lineWidthSlider && widthValueDisplay) {
        lineWidthSlider.addEventListener('input', function() {
            widthValueDisplay.textContent = lineWidthSlider.value;
            console.log('Line width changed to:', lineWidthSlider.value);
            // Sadece yeni çizimler için kalınlık değişir
        });
    }

    // Point mode button
    if (pointModeBtn) {
        pointModeBtn.addEventListener('click', function() {
            toggleMode('point');
        });
    }

    // Route mode button
    if (routeModeBtn) {
        routeModeBtn.addEventListener('click', function() {
            toggleMode('route');
        });
    }

    // Clear all button
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', function() {
            if (confirm('Tüm çizimleri silmek istediğinizden emin misiniz?')) {
                if (window.clearRoutes) {
                    window.clearRoutes();
                }
                setMode(null);
                showNotification('Tüm çizimler temizlendi!', 'success');
            }
        });
    }

    // Save routes button
    if (saveRoutesBtn) {
        saveRoutesBtn.addEventListener('click', function() {
            if (window.saveRoutes) {
                window.saveRoutes();
            }
        });
    }

    // Undo button
    if (undoBtn) {
        undoBtn.addEventListener('click', function() {
            if (window.undo && window.canUndo()) {
                window.undo();
                updateUndoButton();
            }
        });
    }

    // Function to toggle drawing mode
    function toggleMode(mode) {
        if (currentMode === mode) {
            setMode(null);
        } else {
            setMode(mode);
        }
    }

    // Function to set drawing mode
    function setMode(mode) {
        // Finish current route if switching from route mode
        if (currentMode === 'route' && window.finishRoute) {
            window.finishRoute();
        }

        currentMode = mode;
        updateButtonStates();
        updateUndoButton(); // Undo butonunu güncelle

        // Set map drawing mode
        if (window.setDrawingMode) {
            window.setDrawingMode(mode);
        }

        // Show appropriate notification
        if (mode === 'point') {
            const color = document.getElementById('color-picker')?.value || '#ff0000';
            showNotification(`🎯 Point ekleme modu aktif!\nRenk: ${color}\nHaritaya tıklayarak point ekleyin.`, 'info');
        } else if (mode === 'route') {
            const color = document.getElementById('color-picker')?.value || '#ff0000';
            const style = document.getElementById('line-style')?.value || 'solid';
            const width = document.getElementById('line-width')?.value || '4';
            
            const styleNames = {
                'solid': 'Düz',
                'dashed': 'Kesikli', 
                'dotted': 'Noktalı'
            };
            
            showNotification(`🛣️ Rota çizme modu aktif!\nRenk: ${color} | Stil: ${styleNames[style]} | Kalınlık: ${width}px\nTıklayarak rota çizin, Enter ile bitirin.`, 'info');
        } else {
            showNotification('Çizim modu kapatıldı.', 'info');
        }
    }

    // Function to update button states
    function updateButtonStates() {
        if (pointModeBtn) pointModeBtn.classList.remove('active');
        if (routeModeBtn) routeModeBtn.classList.remove('active');

        if (currentMode === 'point' && pointModeBtn) {
            pointModeBtn.classList.add('active');
        } else if (currentMode === 'route' && routeModeBtn) {
            routeModeBtn.classList.add('active');
        }
    }

    // Function to update undo button state
    function updateUndoButton() {
        if (undoBtn) {
            const canUndo = window.canUndo && window.canUndo();
            undoBtn.disabled = !canUndo;
            undoBtn.textContent = canUndo ? 
                `Geri Al (${window.getUndoCount()})` : 'Geri Al';
        }
    }

    // Function to show notifications
    function showNotification(message, type = 'info') {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-size: 13px;
            z-index: 2000;
            max-width: 350px;
            white-space: pre-line;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            ${type === 'success' ? 'background: linear-gradient(135deg, #28a745, #20c997);' :
              type === 'error' ? 'background: linear-gradient(135deg, #dc3545, #e74c3c);' :
              'background: linear-gradient(135deg, #007cba, #17a2b8);'}
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 4000);
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key.toLowerCase()) {
                case 'p':
                    e.preventDefault();
                    toggleMode('point');
                    break;
                case 'r':
                    e.preventDefault();
                    toggleMode('route');
                    break;
                case 's':
                    e.preventDefault();
                    if (window.saveRoutes) {
                        window.saveRoutes();
                    }
                    break;
                case 'z':
                    e.preventDefault();
                    if (window.undo && window.canUndo()) {
                        window.undo();
                        updateUndoButton();
                    }
                    break;
            }
        } else if (e.key === 'Escape') {
            setMode(null);
        } else if (e.key === 'Enter' && currentMode === 'route') {
            if (window.finishRoute) {
                window.finishRoute();
                updateUndoButton();
            }
        }
    });

    // Periodically update undo button
    setInterval(updateUndoButton, 1000);

    // Load saved data on startup
    setTimeout(() => {
        if (window.loadRoutes) {
            const savedData = localStorage.getItem('mapDrawings');
            if (savedData) {
                if (confirm('💾 Kaydedilmiş çizimler bulundu. Yüklemek istiyor musunuz?')) {
                    window.loadRoutes();
                }
            }
        }
    }, 1000);

    // Make showNotification globally available
    window.showNotification = showNotification;

    console.log('✅ Drawing controls initialized successfully');
});