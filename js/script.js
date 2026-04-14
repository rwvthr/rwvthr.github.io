// ============================================================================
// CONFIGURAÇÕES GLOBAIS DO PLANO CARTESIANO
// ============================================================================

const CARTESIAN_CONFIG = {
    size: 550,
    scale: 25,
    xMin: -10,
    xMax: 10,
    yMin: -10,
    yMax: 10,
    colors: {
        // Fundo do Canvas: Branco mantido para contraste máximo com o grid escuro da interface
        background: '#FFFFFF', 
        // Grid: Cinza claro neutro
        grid: '#E5E9F0',
        // Eixos: Grafite escuro (quase preto)
        axis: '#161C24',
        // Labels dos Eixos (x, y): Cinza escuro profissional
        axisLabels: '#1C2432',
        // Números dos Eixos: Cinza médio
        axisNumbers: '#6B7689',
        // Origem (0): Ciano Corporativo (substitui o laranja #ff6600)
        origin: '#0055c4',
        // Label da Origem: Ciano mais escuro para contraste
        originLabel: '#0049b6',
        // Overlay de bloqueio (fora dos limites): Preto semi-transparente elegante
        overlay: 'rgba(13, 17, 23, 0.85)',
        overlayText: '#FFFFFF'
    },
    lineWidths: {
        grid: 0.5,
        axis: 2.5
    }
};

// Limites do plano cartesiano
const PLANE_LIMITS = {
    xMin: -10,
    xMax: 10,
    yMin: -10,
    yMax: 10
};

/**
 * Verifica se um ponto está dentro dos limites do plano cartesiano
 * @param {number} x - Coordenada X
 * @param {number} y - Coordenada Y
 * @returns {boolean} - True se estiver dentro dos limites
 */
function isWithinLimits(x, y) {
    return x >= PLANE_LIMITS.xMin && x <= PLANE_LIMITS.xMax &&
           y >= PLANE_LIMITS.yMin && y <= PLANE_LIMITS.yMax;
}

/**
 * Verifica se um conjunto de pontos está dentro dos limites
 * @param {Array} points - Array de objetos {x, y}
 * @returns {boolean} - True se todos estiverem dentro dos limites
 */
function areAllPointsWithinLimits(points) {
    return points.every(p => isWithinLimits(p.x, p.y));
}

/**
 * Desenha um overlay sobre o canvas indicando que está inativo
 * @param {CanvasRenderingContext2D} ctx - Contexto 2D do canvas
 * @param {number} size - Tamanho do canvas
 * @param {string} message - Mensagem a ser exibida
 */
function drawInactiveOverlay(ctx, size, message = 'Valores fora do limite permitido (-10 a 10)') {
    // Overlay semi-transparente
    ctx.fillStyle = CARTESIAN_CONFIG.colors.overlay;
    ctx.fillRect(0, 0, size, size);
    
    // Texto de aviso
    ctx.font = 'bold 18px "Inter", sans-serif';
    ctx.fillStyle = CARTESIAN_CONFIG.colors.overlayText;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Quebrar texto em múltiplas linhas se necessário
    const lines = message.split('\n');
    const lineHeight = 28;
    const startY = size / 2 - (lines.length - 1) * lineHeight / 2;
    
    lines.forEach((line, index) => {
        ctx.fillText(line, size / 2, startY + index * lineHeight);
    });
    
    // Resetar alinhamento
    ctx.textAlign = 'start';
    ctx.textBaseline = 'alphabetic';
}

// ============================================================================
// FUNÇÕES UTILITÁRIAS DO PLANO CARTESIANO
// ============================================================================

/**
 * Cria as configurações de centro para um plano cartesiano
 */
function createCenterConfig(size) {
    return {
        centerX: size / 2,
        centerY: size / 2
    };
}

/**
 * Converte coordenadas reais (x, y) para pixels no canvas
 */
function toPixel(x, y, centerX, centerY, scale) {
    return {
        x: centerX + x * scale,
        y: centerY - y * scale
    };
}

/**
 * Desenha o plano cartesiano completo (fundo, grid, eixos, setas, números e origem)
 * @param {CanvasRenderingContext2D} ctx - Contexto 2D do canvas
 * @param {Object} config - Configurações do plano (tamanho, escala, cores, etc.)
 * @param {number} centerX - Coordenada X do centro
 * @param {number} centerY - Coordenada Y do centro
 */
function drawCartesianPlane(ctx, config, centerX, centerY) {
    const { size, scale, xMin, xMax, yMin, yMax, colors, lineWidths } = config;
    
    // Limpar canvas
    ctx.clearRect(0, 0, size, size);
    
    // Fundo claro
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, size, size);
    
    // Desenhar linhas de grid
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = lineWidths.grid;
    
    // Linhas verticais do grid
    for (let x = xMin; x <= xMax; x++) {
        if (x === 0) continue;
        const pixelX = centerX + x * scale;
        ctx.beginPath();
        ctx.moveTo(pixelX, 0);
        ctx.lineTo(pixelX, size);
        ctx.stroke();
    }
    
    // Linhas horizontais do grid
    for (let y = yMin; y <= yMax; y++) {
        if (y === 0) continue;
        const pixelY = centerY - y * scale;
        ctx.beginPath();
        ctx.moveTo(0, pixelY);
        ctx.lineTo(size, pixelY);
        ctx.stroke();
    }
    
    // Eixo X (eixo horizontal)
    ctx.beginPath();
    ctx.strokeStyle = colors.axis;
    ctx.lineWidth = lineWidths.axis;
    ctx.moveTo(0, centerY);
    ctx.lineTo(size, centerY);
    ctx.stroke();
    
    // Eixo Y (eixo vertical)
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, size);
    ctx.stroke();
    
    // Setas dos eixos
    ctx.fillStyle = colors.axis;
    // Seta X
    ctx.beginPath();
    ctx.moveTo(size - 10, centerY - 5);
    ctx.lineTo(size, centerY);
    ctx.lineTo(size - 10, centerY + 5);
    ctx.fill();
    // Seta Y
    ctx.beginPath();
    ctx.moveTo(centerX - 5, 10);
    ctx.lineTo(centerX, 0);
    ctx.lineTo(centerX + 5, 10);
    ctx.fill();
    
    // Rótulos dos eixos (x e y)
    ctx.font = 'bold 14px "Inter", monospace';
    ctx.fillStyle = colors.axisLabels;
    ctx.fillText('x', size - 20, centerY - 10);
    ctx.fillText('y', centerX + 12, 18);
    
    // Marcar números nos eixos
    ctx.font = '11px "Inter"';
    ctx.fillStyle = colors.axisNumbers;
    for (let x = xMin; x <= xMax; x++) {
        if (x === 0) continue;
        const pixelX = centerX + x * scale;
        ctx.fillText(x.toString(), pixelX - 6, centerY + 18);
    }
    for (let y = yMin; y <= yMax; y++) {
        if (y === 0) continue;
        const pixelY = centerY - y * scale;
        ctx.fillText(y.toString(), centerX + 8, pixelY + 4);
    }
    
    // Origem
    ctx.fillStyle = colors.origin;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 3, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = colors.originLabel;
    ctx.font = 'bold 12px monospace';
    ctx.fillText('0', centerX + 6, centerY + 16);
}

/**
 * Configura um canvas com as dimensões padrão do plano cartesiano
 */
function setupCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error(`Canvas "${canvasId}" não encontrado!`);
        return null;
    }
    
    const { size } = CARTESIAN_CONFIG;
    canvas.width = size;
    canvas.height = size;
    
    const ctx = canvas.getContext('2d');
    const center = createCenterConfig(size);
    
    return { canvas, ctx, ...center };
}

// ============================================================================
// PRIMEIRO PLANO - Pontos, Distância e Ponto Médio
// ============================================================================

(function() {
    // Aguardar o DOM carregar completamente
    function initCartesianPlane() {
        const setup = setupCanvas('cartesianCanvas');
        if (!setup) return;
        
        const { canvas, ctx, centerX, centerY } = setup;
        const { scale } = CARTESIAN_CONFIG;
        
        // Array para armazenar pontos (cada ponto = {x, y})
        let points = [];
        
        // Modo de visualização atual
        let currentViewMode = 'points';
        let selectedPointA = null;
        let selectedPointB = null;
        
        // Calcular distância entre dois pontos
        function calculateDistance(x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        }
        
        // Calcular ponto médio
        function calculateMidpoint(x1, y1, x2, y2) {
            return {
                x: (x1 + x2) / 2,
                y: (y1 + y2) / 2
            };
        }
        
        // Desenhar linha entre dois pontos
        function drawLineBetweenPoints(x1, y1, x2, y2) {
            const p1 = toPixel(x1, y1, centerX, centerY, scale);
            const p2 = toPixel(x2, y2, centerX, centerY, scale);
            
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = '#0273cf';
            ctx.lineWidth = 2.5;
            ctx.setLineDash([8, 4]);
            ctx.stroke();
            ctx.setLineDash([]);
        }
        
        // Desenhar ponto médio
        function drawMidpoint(x, y) {
            const pixel = toPixel(x, y, centerX, centerY, scale);
            
            ctx.beginPath();
            ctx.arc(pixel.x, pixel.y, 8, 0, 2 * Math.PI);
            ctx.fillStyle = '#006ace';
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2.5;
            ctx.stroke();
            
            ctx.font = 'bold 13px "Inter"';
            ctx.fillStyle = '#001336';
            ctx.fillText(`Médio (${x.toFixed(2)}, ${y.toFixed(2)})`, pixel.x + 12, pixel.y - 8);
        }
        
        // Desenhar todos os pontos armazenados
        function drawPoints() {
            // Primeiro desenha a linha se estiver no modo distância
            if (currentViewMode === 'distance' && selectedPointA !== null && selectedPointB !== null) {
                const pointA = points[selectedPointA];
                const pointB = points[selectedPointB];
                if (pointA && pointB) {
                    drawLineBetweenPoints(pointA.x, pointA.y, pointB.x, pointB.y);
                    
                    // Calcular e desenhar ponto médio
                    const midpoint = calculateMidpoint(pointA.x, pointA.y, pointB.x, pointB.y);
                    drawMidpoint(midpoint.x, midpoint.y);
                }
            }
            
            // Depois desenha todos os pontos
            for (let i = 0; i < points.length; i++) {
                const p = points[i];
                const { x: pixelX, y: pixelY } = toPixel(p.x, p.y, centerX, centerY, scale);
                
                // Cores diferentes para pontos selecionados
                let pointColor = '#0787f0';
                if (currentViewMode === 'distance') {
                    if (i === selectedPointA) pointColor = '#0787f0';
                    else if (i === selectedPointB) pointColor = '#00aeff';
                }
                
                // Desenhar círculo
                ctx.beginPath();
                ctx.arc(pixelX, pixelY, 7, 0, 2 * Math.PI);
                ctx.fillStyle = pointColor;
                ctx.fill();
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.stroke();
                
                // Mostrar coordenada ao lado do ponto
                ctx.font = 'bold 13px "Inter"';
                ctx.fillStyle = '#1e2f5a';
                ctx.shadowBlur = 0;
                
                let label = `P${i} (${p.x.toFixed(2)}, ${p.y.toFixed(2)})`;
                if (currentViewMode === 'distance') {
                    if (i === selectedPointA) label = `A ${label}`;
                    else if (i === selectedPointB) label = `B ${label}`;
                }
                ctx.fillText(label, pixelX + 10, pixelY - 6);
            }
        }
        
        // Atualizar os seletores de pontos
        function updatePointSelectors() {
            const selectA = document.getElementById('pointASelect');
            const selectB = document.getElementById('pointBSelect');
            
            if (!selectA || !selectB) return;
            
            // Limpar opções
            selectA.innerHTML = '<option value="">Selecione um ponto</option>';
            selectB.innerHTML = '<option value="">Selecione um ponto</option>';
            
            // Adicionar opções para cada ponto
            points.forEach((point, index) => {
                const optionA = document.createElement('option');
                optionA.value = index;
                optionA.textContent = `P${index} (${point.x.toFixed(2)}, ${point.y.toFixed(2)})`;
                selectA.appendChild(optionA);
                
                const optionB = document.createElement('option');
                optionB.value = index;
                optionB.textContent = `P${index} (${point.x.toFixed(2)}, ${point.y.toFixed(2)})`;
                selectB.appendChild(optionB);
            });
            
            // Restaurar seleções anteriores se ainda existirem
            if (selectedPointA !== null && selectedPointA < points.length) {
                selectA.value = selectedPointA;
            }
            if (selectedPointB !== null && selectedPointB < points.length) {
                selectB.value = selectedPointB;
            }
        }
        
        // Atualizar resultados de distância e ponto médio
        function updateDistanceResults() {
            const distanceSpan = document.getElementById('distanceValue');
            const midpointSpan = document.getElementById('midpointValue');
            
            if (!distanceSpan || !midpointSpan) return;
            
            if (selectedPointA !== null && selectedPointB !== null && 
                selectedPointA < points.length && selectedPointB < points.length) {
                const pointA = points[selectedPointA];
                const pointB = points[selectedPointB];
                
                const distance = calculateDistance(pointA.x, pointA.y, pointB.x, pointB.y);
                const midpoint = calculateMidpoint(pointA.x, pointA.y, pointB.x, pointB.y);
                
                distanceSpan.textContent = distance.toFixed(3);
                midpointSpan.textContent = `(${midpoint.x.toFixed(2)}, ${midpoint.y.toFixed(2)})`;
            } else {
                distanceSpan.textContent = '---';
                midpointSpan.textContent = '---';
            }
        }
        
        // Atualizar display de coordenada atual
        function updateCoordDisplay(x, y) {
            const displaySpan = document.getElementById('coordDisplay');
            if (displaySpan) {
                displaySpan.innerText = `(${x.toFixed(2)}, ${y.toFixed(2)})`;
            }
        }
        
        // Adicionar ponto e redesenhar
        function addPoint(x, y) {
            // Arredondar para 2 casas decimais
            x = Math.round(x * 100) / 100;
            y = Math.round(y * 100) / 100;
            
            // Adicionar ponto mesmo se estiver fora dos limites (overlay será mostrado)
            points.push({ x: x, y: y });
            
            // Atualizar seletores se estiver no modo distância
            if (currentViewMode === 'distance') {
                updatePointSelectors();
            }
            
            render();
            updateCoordDisplay(x, y);
        }
        
        // Limpar todos os pontos
        function clearPoints() {
            points = [];
            selectedPointA = null;
            selectedPointB = null;
            
            // Limpar os campos de input para zero
            const inputX = document.getElementById('xCoord');
            const inputY = document.getElementById('yCoord');
            if (inputX) inputX.value = 0;
            if (inputY) inputY.value = 0;
            
            // Atualizar seletores
            if (currentViewMode === 'distance') {
                updatePointSelectors();
                updateDistanceResults();
            }

            // Redesenhar o gráfico (agora vazio)
            render();

            // Atualizar o display azul de "Ponto Atual" para (0,0)
            updateCoordDisplay(0, 0);
        }
        
        // Renderização completa
        function render() {
            // Verificar se TODOS os pontos estão TOTALMENTE fora do plano visível
            // Um conjunto de pontos some completamente se TODOS estiverem fora em uma mesma direção
            
            let isTotallyOutOfBounds = false;
            
            if (points.length > 0) {
                // Verificar se todos os pontos estão fora em uma mesma direção
                const allLeft = points.every(p => p.x < PLANE_LIMITS.xMin);
                const allRight = points.every(p => p.x > PLANE_LIMITS.xMax);
                const allBelow = points.every(p => p.y < PLANE_LIMITS.yMin);
                const allAbove = points.every(p => p.y > PLANE_LIMITS.yMax);
                
                if (allLeft || allRight || allBelow || allAbove) {
                    isTotallyOutOfBounds = true;
                }
            }
            
            drawCartesianPlane(ctx, CARTESIAN_CONFIG, centerX, centerY);
            drawPoints();
            
            if (isTotallyOutOfBounds) {
                drawInactiveOverlay(ctx, CARTESIAN_CONFIG.size, 'Pontos fora do limite\n(-10 a 10)');
            }
        }
        
        // Eventos de UI
        const plotBtn = document.getElementById('plotPointBtn');
        const clearBtn = document.getElementById('clearCanvasBtn');
        const xInput = document.getElementById('xCoord');
        const yInput = document.getElementById('yCoord');
        const viewModeSelect = document.getElementById('viewMode');
        const pointSelectors = document.getElementById('pointSelectors');
        const pointASelect = document.getElementById('pointASelect');
        const pointBSelect = document.getElementById('pointBSelect');
        
        // Evento do seletor de modo
        if (viewModeSelect) {
            viewModeSelect.addEventListener('change', (e) => {
                currentViewMode = e.target.value;
                
                if (currentViewMode === 'distance') {
                    pointSelectors.style.display = 'block';
                    updatePointSelectors();
                    selectedPointA = null;
                    selectedPointB = null;
                    updateDistanceResults();
                    // Limpar o gráfico quando mudar para distância e ponto médio
                    clearPoints();
                } else {
                    pointSelectors.style.display = 'none';
                    selectedPointA = null;
                    selectedPointB = null;
                    updateDistanceResults();
                }
                
                render();
            });
        }
        
        // Eventos dos seletores de pontos
        if (pointASelect) {
            pointASelect.addEventListener('change', (e) => {
                selectedPointA = e.target.value === '' ? null : parseInt(e.target.value);
                updateDistanceResults();
                render();
            });
        }
        
        if (pointBSelect) {
            pointBSelect.addEventListener('change', (e) => {
                selectedPointB = e.target.value === '' ? null : parseInt(e.target.value);
                updateDistanceResults();
                render();
            });
        }
        
        if (plotBtn) {
            plotBtn.addEventListener('click', () => {
                let x = parseFloat(xInput?.value);
                let y = parseFloat(yInput?.value);
                if (isNaN(x) || isNaN(y)) {
                    alert('Por favor, insira valores numéricos válidos para X e Y.');
                    return;
                }
                addPoint(x, y);
            });
        }
        
        if (clearBtn) {
            clearBtn.addEventListener('click', clearPoints);
        }
        
        // Atualizar inputs quando mudar manualmente
        if (xInput && yInput) {
            xInput.addEventListener('change', () => {
                let val = parseFloat(xInput.value);
                if (!isNaN(val) && points.length > 0) {
                    updateCoordDisplay(val, parseFloat(yInput.value) || 0);
                }
            });
            yInput.addEventListener('change', () => {
                let val = parseFloat(yInput.value);
                if (!isNaN(val) && points.length > 0) {
                    updateCoordDisplay(parseFloat(xInput.value) || 0, val);
                }
            });
        }
        
        // Clique no canvas: capturar coordenadas do clique e adicionar ponto
        canvas.addEventListener('click', (event) => {
            const rect = canvas.getBoundingClientRect();
            const scaleXCanvas = canvas.width / rect.width;
            const scaleYCanvas = canvas.height / rect.height;
            
            const mouseX = (event.clientX - rect.left) * scaleXCanvas;
            const mouseY = (event.clientY - rect.top) * scaleYCanvas;
            
            // Converter pixel para coordenada real
            const realX = (mouseX - centerX) / scale;
            const realY = (centerY - mouseY) / scale;
            
            addPoint(realX, realY);
            if (xInput) xInput.value = Math.round(realX * 100) / 100;
            if (yInput) yInput.value = Math.round(realY * 100) / 100;
        });
        
        // Inicializar com um ponto de exemplo (3,2)
        points.push({ x: 3, y: 2 });
        render();
        updateCoordDisplay(3, 2);
        if (xInput) xInput.value = 3;
        if (yInput) yInput.value = 2;
        
        // Garantir que comece com "APENAS PONTOS"
        if (viewModeSelect) {
            viewModeSelect.value = 'points';
            pointSelectors.style.display = 'none';
        }
        
        // Inicializar seletores se necessário
        if (currentViewMode === 'distance') {
            updatePointSelectors();
        }
    }
    
    // Inicializar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCartesianPlane);
    } else {
        initCartesianPlane();
    }
})();



// ============================================================================
// SEGUNDO PLANO - Equações da Reta
// ============================================================================

(function() {
    function initSecondPlane() {
        const setup = setupCanvas('cartesianCanvas2');
        if (!setup) return;
        
        const { canvas, ctx, centerX, centerY } = setup;
        const { scale } = CARTESIAN_CONFIG;
        
        const modeSelect = document.getElementById('calcMode') || document.querySelector('.view-mode-select');
        const dynamicContainer = document.getElementById('dynamicInputs');
        const plotBtn = document.getElementById('plotBtn2');
        const clearBtn = document.getElementById('clearBtn2');
        const resultDiv = document.getElementById('resultDisplay');

        // --- FUNÇÕES DE DESENHO ESPECÍFICAS ---

        function drawLine(m, n) {
            drawCartesianPlane(ctx, CARTESIAN_CONFIG, centerX, centerY);
            
            const xStart = -25;
            const xEnd = 25;
            const p1 = toPixel(xStart, m * xStart + n, centerX, centerY, scale);
            const p2 = toPixel(xEnd, m * xEnd + n, centerX, centerY, scale);

            ctx.beginPath();
            ctx.strokeStyle = '#0455cf';
            ctx.lineWidth = 4;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            
            // Verificar se a reta está TOTALMENTE fora do plano visível
            // Uma reta só some completamente se estiver fora em ambos os lados do plano
            // ou se for horizontal/vertical muito distante
            
            let isTotallyOutOfBounds = false;
            
            // Calcular Y nos limites do plano (x = -10 e x = 10)
            const yAtXMin = m * PLANE_LIMITS.xMin + n;  // Y quando x = -10
            const yAtXMax = m * PLANE_LIMITS.xMax + n;  // Y quando x = 10
            
            // Se ambos os pontos de entrada/saída do plano estão fora verticalmente
            if (Math.abs(yAtXMin) > PLANE_LIMITS.yMax && Math.abs(yAtXMax) > PLANE_LIMITS.yMax) {
                // Ambos estão acima ou ambos estão abaixo
                if ((yAtXMin > PLANE_LIMITS.yMax && yAtXMax > PLANE_LIMITS.yMax) ||
                    (yAtXMin < PLANE_LIMITS.yMin && yAtXMax < PLANE_LIMITS.yMin)) {
                    isTotallyOutOfBounds = true;
                }
            }
            
            // Caso especial: reta horizontal muito acima/abaixo
            if (m === 0 && Math.abs(n) > PLANE_LIMITS.yMax) {
                isTotallyOutOfBounds = true;
            }
            
            // Caso especial: reta vertical (m = Infinity)
            // interceptX = -n/m, se m tende a infinito, interceptX tende a 0
            // Mas se a reta é vertical, x1 = x2, então já foi tratada como erro
            
            if (isTotallyOutOfBounds) {
                drawInactiveOverlay(ctx, CARTESIAN_CONFIG.size, 'Reta fora do limite visível\n(-10 a 10)');
            }
        }

        // --- LÓGICA DE INTERFACE ---

        function updateInputs() {
            const mode = modeSelect.value;
            let html = '';

            // LIMPAR O RESULTADO AO TROCAR DE MODO
            resultDiv.innerHTML = 'Aguardando dados...';
            
            // Limpa classes de layout anteriores
            dynamicContainer.classList.remove('layout-angular', 'layout-reduzida', 'layout-geral');

            if (mode === 'angular') {
                dynamicContainer.classList.add('layout-angular');
                html = `
                    <div class="input-row">
                        <div class="input-group"><label>X1</label><input type="number" id="x1" value="1"></div>
                        <div class="input-group"><label>Y1</label><input type="number" id="y1" value="1"></div>
                    </div>
                    <div class="input-row">
                        <div class="input-group"><label>X2</label><input type="number" id="x2" value="4"></div>
                        <div class="input-group"><label>Y2</label><input type="number" id="y2" value="5"></div>
                    </div>`;
            } else if (mode === 'reduzida') {
                dynamicContainer.classList.add('layout-reduzida');
                html = `
                    <div class="input-group"><label>m</label><input type="number" id="mVal" value="1"></div>
                    <div class="input-group"><label>n</label><input type="number" id="nVal" value="0"></div>`;
            } else if (mode === 'geral') {
                dynamicContainer.classList.add('layout-geral');
                html = `
                    <div class="input-row">
                        <div class="input-group"><label>a</label><input type="number" id="aVal" value="1"></div>
                        <div class="input-group"><label>b</label><input type="number" id="bVal" value="-1"></div>
                    </div>
                    <div class="input-row">
                        <div class="input-group"><label>c</label><input type="number" id="cVal" value="0"></div>
                    </div>`;
            }
            
            dynamicContainer.innerHTML = html;
            drawCartesianPlane(ctx, CARTESIAN_CONFIG, centerX, centerY);
        }

        function handlePlot() {
            const mode = modeSelect.value;
            let m, n;

            try {
                if (mode === 'angular') {
                    const x1 = parseFloat(document.getElementById('x1').value);
                    const y1 = parseFloat(document.getElementById('y1').value);
                    const x2 = parseFloat(document.getElementById('x2').value);
                    const y2 = parseFloat(document.getElementById('y2').value);
                    if (x1 === x2) throw "Reta Vertical!";
                    m = (y2 - y1) / (x2 - x1);
                    n = y1 - m * x1;
                } else if (mode === 'reduzida') {
                    m = parseFloat(document.getElementById('mVal').value);
                    n = parseFloat(document.getElementById('nVal').value);
                } else if (mode === 'geral') {
                    const a = parseFloat(document.getElementById('aVal').value);
                    const b = parseFloat(document.getElementById('bVal').value);
                    const c = parseFloat(document.getElementById('cVal').value);
                    if (b === 0) throw "Reta Vertical!";
                    m = -a / b;
                    n = -c / b;
                }

                if (isNaN(m) || isNaN(n)) throw "Preencha todos os campos!";

                drawLine(m, n);
                
                const sinal = n >= 0 ? "+" : "-";
                resultDiv.innerHTML = `<b>Equação:</b> y = ${m.toFixed(2)}x ${sinal} ${Math.abs(n).toFixed(2)}`;

            } catch (e) {
                alert(e);
            }
        }

        // Inicialização e Listeners
        if (modeSelect) {
            modeSelect.addEventListener('change', updateInputs);
        }
        if (plotBtn) {
            plotBtn.addEventListener('click', handlePlot);
        }
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                updateInputs();
                resultDiv.innerHTML = 'Aguardando dados...';
            });
        }

        // Chamada inicial para garantir que o gráfico apareça no refresh
        updateInputs();
        
        // Garantir que comece com "COEFICIENTE ANGULAR"
        if (modeSelect) {
            modeSelect.value = 'angular';
        }
    }

    // Inicializar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSecondPlane);
    } else {
        initSecondPlane();
    }
})();


// ============================================================================
// TERCEIRO PLANO - Gráficos de Funções Matemáticas
// ============================================================================

(function() {
    function initThirdPlane() {
        const setup = setupCanvas('cartesianCanvas3');
        if (!setup) return;
        
        const { canvas, ctx, centerX, centerY } = setup;
        const { scale } = CARTESIAN_CONFIG;
        
        const graphTypeSelect = document.getElementById('graphType');
        const graphInputs = document.getElementById('graphInputs');
        const plotGraphBtn = document.getElementById('plotGraphBtn');
        const clearGraphBtn = document.getElementById('clearGraphBtn');
        const graphResult = document.getElementById('graphResult');

        // --- FUNÇÕES DE DESENHO DE GRÁFICOS ---

        function drawCircle(a, b, r) {
            drawCartesianPlane(ctx, CARTESIAN_CONFIG, centerX, centerY);
            
            // Verificar se a circunferência está TOTALMENTE fora do plano visível
            // Uma circunferência some completamente se TODA ela estiver fora dos limites
            // Isso acontece quando o centro ± raio está todo fora em uma direção
            
            let isTotallyOutOfBounds = false;
            
            // Se toda a circunferência está à esquerda do plano
            if ((a + r) < PLANE_LIMITS.xMin) {  // extremidade direita < limite esquerdo
                isTotallyOutOfBounds = true;
            }
            // Se toda a circunferência está à direita do plano
            if ((a - r) > PLANE_LIMITS.xMax) {  // extremidade esquerda > limite direito
                isTotallyOutOfBounds = true;
            }
            // Se toda a circunferência está abaixo do plano
            if ((b + r) < PLANE_LIMITS.yMin) {  // extremidade superior < limite inferior
                isTotallyOutOfBounds = true;
            }
            // Se toda a circunferência está acima do plano
            if ((b - r) > PLANE_LIMITS.yMax) {  // extremidade inferior > limite superior
                isTotallyOutOfBounds = true;
            }
            
            // Desenhar circunferência usando arco
            const centerPixel = toPixel(a, b, centerX, centerY, scale);
            
            ctx.beginPath();
            ctx.arc(centerPixel.x, centerPixel.y, r * scale, 0, 2 * Math.PI);
            ctx.strokeStyle = '#2E86AB';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Preencher levemente
            ctx.fillStyle = 'rgba(46, 134, 171, 0.1)';
            ctx.fill();
            
            if (isTotallyOutOfBounds) {
                drawInactiveOverlay(ctx, CARTESIAN_CONFIG.size, 'Circunferência fora do limite\n(-10 a 10)');
            }
        }

        function drawEllipse(h, k, a, b) {
            drawCartesianPlane(ctx, CARTESIAN_CONFIG, centerX, centerY);
            
            // Verificar se a elipse está TOTALMENTE fora do plano visível
            // Uma elipse some completamente se TODA ela estiver fora dos limites
            
            let isTotallyOutOfBounds = false;
            
            // Se toda a elipse está à esquerda do plano
            if ((h + a) < PLANE_LIMITS.xMin) {  // extremidade direita < limite esquerdo
                isTotallyOutOfBounds = true;
            }
            // Se toda a elipse está à direita do plano
            if ((h - a) > PLANE_LIMITS.xMax) {  // extremidade esquerda > limite direito
                isTotallyOutOfBounds = true;
            }
            // Se toda a elipse está abaixo do plano
            if ((k + b) < PLANE_LIMITS.yMin) {  // extremidade superior < limite inferior
                isTotallyOutOfBounds = true;
            }
            // Se toda a elipse está acima do plano
            if ((k - b) > PLANE_LIMITS.yMax) {  // extremidade inferior > limite superior
                isTotallyOutOfBounds = true;
            }
            
            // Desenhar elipse usando escala
            const centerPixel = toPixel(h, k, centerX, centerY, scale);
            
            ctx.beginPath();
            ctx.ellipse(centerPixel.x, centerPixel.y, a * scale, b * scale, 0, 0, 2 * Math.PI);
            ctx.strokeStyle = '#A23B72';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Preencher levemente
            ctx.fillStyle = 'rgba(162, 59, 114, 0.1)';
            ctx.fill();
            
            if (isTotallyOutOfBounds) {
                drawInactiveOverlay(ctx, CARTESIAN_CONFIG.size, 'Elipse fora do limite\n(-10 a 10)');
            }
        }

        function drawParabola(a, b, c) {
            drawCartesianPlane(ctx, CARTESIAN_CONFIG, centerX, centerY);
            
            // Calcular vértice da parábola
            const vx = -b / (2 * a);
            const vy = a * Math.pow(vx, 2) + b * vx + c;
            
            // Verificar se a parábola está TOTALMENTE fora do plano visível
            // Uma parábola some completamente se não cruza o plano visível
            
            let isTotallyOutOfBounds = false;
            
            // Para parábolas que abrem para cima (a > 0):
            // Some se o vértice está acima do plano e as extremidades também
            // Para parábolas que abrem para baixo (a < 0):
            // Some se o vértice está abaixo do plano e as extremidades também
            
            if (a > 0) {
                // Parábola abre para cima - some se o vértice está muito acima
                if (vy > PLANE_LIMITS.yMax) {
                    isTotallyOutOfBounds = true;
                }
            } else {
                // Parábola abre para baixo - some se o vértice está muito abaixo
                if (vy < PLANE_LIMITS.yMin) {
                    isTotallyOutOfBounds = true;
                }
            }
            
            // Desenhar parábola ponto a ponto
            ctx.beginPath();
            let firstPoint = true;
            
            // Iterar sobre o domínio visível
            for (let x = -25; x <= 25; x += 0.1) {
                const y = a * Math.pow(x, 2) + b * x + c;
                
                // Verificar se o ponto está dentro dos limites visíveis
                if (y >= -25 && y <= 25) {
                    const pixel = toPixel(x, y, centerX, centerY, scale);
                    
                    if (firstPoint) {
                        ctx.moveTo(pixel.x, pixel.y);
                        firstPoint = false;
                    } else {
                        ctx.lineTo(pixel.x, pixel.y);
                    }
                }
            }
            
            ctx.strokeStyle = '#003cbe';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            if (isTotallyOutOfBounds) {
                drawInactiveOverlay(ctx, CARTESIAN_CONFIG.size, 'Parábola fora do limite\n(-10 a 10)');
            }
        }

        // --- LÓGICA DE INTERFACE ---

        function updateGraphInputs() {
            const type = graphTypeSelect.value;
            let html = '';
            let title = '';

            // Limpar resultado ao trocar de tipo
            graphResult.innerHTML = 'Aguardando parâmetros...';
            
            // Limpa classes de layout anteriores
            graphInputs.classList.remove('layout-circle', 'layout-ellipse', 'layout-parabola');

            if (type === 'circle') {
                graphInputs.classList.add('layout-circle');
                html = `
                    <div class="input-row">
                        <div class="input-group"><label>X (a)</label><input type="number" id="circleA" value="0"></div>
                        <div class="input-group"><label>Y (b)</label><input type="number" id="circleB" value="0"></div>
                    </div>
                    <div class="input-row">
                        <div class="input-group"><label>Raio (r)</label><input type="number" id="circleR" value="5" step="0.1"></div>
                    </div> `;
            } else if (type === 'ellipse') {
                graphInputs.classList.add('layout-ellipse');
                html = `
                    <div class="input-row">
                        <div class="input-group"><label>X (h)</label><input type="number" id="ellipseH" value="0"></div>
                        <div class="input-group"><label>Y (k)</label><input type="number" id="ellipseK" value="0"></div>
                    </div>
                    <div class="input-row">
                        <div class="input-group"><label>X (a)</label><input type="number" id="ellipseA" value="4" step="0.1"></div>
                        <div class="input-group"><label>Y (b)</label><input type="number" id="ellipseB" value="3" step="0.1"></div>
                    </div>`;
            } else if (type === 'parabola') {
                graphInputs.classList.add('layout-parabola');
                html = `
                    <div class="input-row">
                        <div class="input-group"><label>a</label><input type="number" id="parabolaA" value="1"></div>
                        <div class="input-group"><label>b</label><input type="number" id="parabolaB" value="0"></div>
                    </div>
                    <div class="input-row">
                        <div class="input-group"><label>c</label><input type="number" id="parabolaC" value="0"></div>
                    </div>
                    `;
            }
            
            graphInputs.innerHTML = html;
            drawCartesianPlane(ctx, CARTESIAN_CONFIG, centerX, centerY);
        }

        function handlePlotGraph() {
            const type = graphTypeSelect.value;

            try {
                if (type === 'circle') {
                    const a = parseFloat(document.getElementById('circleA').value);
                    const b = parseFloat(document.getElementById('circleB').value);
                    const r = parseFloat(document.getElementById('circleR').value);
                    
                    if (isNaN(a) || isNaN(b) || isNaN(r)) throw "Preencha todos os campos!";
                    if (r <= 0) throw "O raio deve ser maior que zero!";
                    
                    drawCircle(a, b, r);
                    graphResult.innerHTML = `<b>Fórmula:</b> (x - ${a})² + (y - ${b})² = ${r}²`;
                    
                } else if (type === 'ellipse') {
                    const h = parseFloat(document.getElementById('ellipseH').value);
                    const k = parseFloat(document.getElementById('ellipseK').value);
                    const a = parseFloat(document.getElementById('ellipseA').value);
                    const b = parseFloat(document.getElementById('ellipseB').value);
                    
                    if (isNaN(h) || isNaN(k) || isNaN(a) || isNaN(b)) throw "Preencha todos os campos!";
                    if (a <= 0 || b <= 0) throw "Os semieixos devem ser maiores que zero!";
                    
                    drawEllipse(h, k, a, b);
                    graphResult.innerHTML = `<b>Fórmula:</b> (x - ${h})²/${a}² + (y - ${k})²/${b}² = 1`;
                    
                } else if (type === 'parabola') {
                    const a = parseFloat(document.getElementById('parabolaA').value);
                    const b = parseFloat(document.getElementById('parabolaB').value);
                    const c = parseFloat(document.getElementById('parabolaC').value);
                    
                    if (isNaN(a) || isNaN(b) || isNaN(c)) throw "Preencha todos os campos!";
                    if (a === 0) throw "O coeficiente 'a' não pode ser zero!";
                    
                    drawParabola(a, b, c);
                    const bSign = b >= 0 ? "+" : "";
                    const cSign = c >= 0 ? "+" : "";
                    graphResult.innerHTML = `<b>Fórmula:</b> y = ${a}x² ${bSign}${b}x ${cSign}${c}`;
                }

            } catch (e) {
                alert(e);
            }
        }

        function handleClearGraph() {
            updateGraphInputs();
            graphResult.innerHTML = 'Aguardando parâmetros...';
        }

        // Inicialização e Listeners
        if (graphTypeSelect) {
            graphTypeSelect.addEventListener('change', updateGraphInputs);
        }
        if (plotGraphBtn) {
            plotGraphBtn.addEventListener('click', handlePlotGraph);
        }
        if (clearGraphBtn) {
            clearGraphBtn.addEventListener('click', handleClearGraph);
        }

        // Chamada inicial
        updateGraphInputs();
        
        // Garantir que comece com "CIRCUNFERÊNCIA"
        if (graphTypeSelect) {
            graphTypeSelect.value = 'circle';
        }
    }

    // Inicializar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initThirdPlane);
    } else {
        initThirdPlane();
    }
})();



// ============================================================================
// QUARTO PLANO - Baricentro de Triângulos
// ============================================================================

(function() {
    function initFourthPlane() {
        const setup = setupCanvas('cartesianCanvas4');
        if (!setup) return;
        
        const { canvas, ctx, centerX, centerY } = setup;
        const { scale } = CARTESIAN_CONFIG;
        
        const plotTriangleBtn = document.getElementById('plotTriangleBtn');
        const clearTriangleBtn = document.getElementById('clearTriangleBtn');
        const resetPointsBtn = document.getElementById('resetPointsBtn');
        const triangleResult = document.getElementById('triangleResult');
        
        // Pontos do triângulo
        let points = {
            A: { x: 0, y: 0 },
            B: { x: 4, y: 0 },
            C: { x: 2, y: 3 }
        };
        
        let triangleDrawn = false;
        
        // Variáveis para controle do arrasto de pontos
        let isDragging = false;
        let draggedPoint = null;
        const DRAG_THRESHOLD = 15; // Distância em pixels para detectar clique no ponto
        
        // Calcular baricentro
        function calculateBaricenter() {
            return {
                x: (points.A.x + points.B.x + points.C.x) / 3,
                y: (points.A.y + points.B.y + points.C.y) / 3
            };
        }
        
        // Desenhar triângulo
        function drawTriangle() {
            const pA = toPixel(points.A.x, points.A.y, centerX, centerY, scale);
            const pB = toPixel(points.B.x, points.B.y, centerX, centerY, scale);
            const pC = toPixel(points.C.x, points.C.y, centerX, centerY, scale);
            
            // Desenhar o triângulo preenchido
            ctx.beginPath();
            ctx.moveTo(pA.x, pA.y);
            ctx.lineTo(pB.x, pB.y);
            ctx.lineTo(pC.x, pC.y);
            ctx.closePath();
            ctx.fillStyle = 'rgba(46, 134, 171, 0.15)';
            ctx.fill();
            
            // Desenhar as bordas do triângulo
            ctx.strokeStyle = '#2E86AB';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Desenhar medianas (linhas do vértice ao ponto médio do lado oposto)
            drawMedian(points.A, points.B, points.C);
            drawMedian(points.B, points.A, points.C);
            drawMedian(points.C, points.A, points.B);
        }
        
        // Desenhar mediana
        function drawMedian(vertex, p1, p2) {
            const midpoint = {
                x: (p1.x + p2.x) / 2,
                y: (p1.y + p2.y) / 2
            };
            
            const pVertex = toPixel(vertex.x, vertex.y, centerX, centerY, scale);
            const pMidpoint = toPixel(midpoint.x, midpoint.y, centerX, centerY, scale);
            
            ctx.beginPath();
            ctx.moveTo(pVertex.x, pVertex.y);
            ctx.lineTo(pMidpoint.x, pMidpoint.y);
            ctx.strokeStyle = 'rgba(255, 140, 0, 0.4)';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([5, 5]);
            ctx.stroke();
            ctx.setLineDash([]);
        }
        
        // Desenhar pontos do triângulo
        function drawPoints() {
            const pointLabels = ['A', 'B', 'C'];
            const pointCoords = [points.A, points.B, points.C];
            const pointColors = ['#e34d22', '#2E86AB', '#A23B72'];
            
            for (let i = 0; i < 3; i++) {
                const p = pointCoords[i];
                const pixel = toPixel(p.x, p.y, centerX, centerY, scale);
                
                // Desenhar ponto
                ctx.beginPath();
                ctx.arc(pixel.x, pixel.y, 8, 0, 2 * Math.PI);
                ctx.fillStyle = pointColors[i];
                ctx.fill();
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2.5;
                ctx.stroke();
                
                // Label do ponto
                ctx.font = 'bold 14px "Inter"';
                ctx.fillStyle = '#1e2f5a';
                ctx.fillText(pointLabels[i], pixel.x + 12, pixel.y - 10);
                
                // Coordenadas
                ctx.font = '11px "Inter"';
                ctx.fillStyle = '#666';
                ctx.fillText(`(${p.x.toFixed(2)}, ${p.y.toFixed(2)})`, pixel.x + 12, pixel.y + 5);
            }
        }
        
        // Desenhar baricentro
        function drawBaricenter() {
            const G = calculateBaricenter();
            const pixel = toPixel(G.x, G.y, centerX, centerY, scale);
            
            // Círculo maior para o baricentro
            ctx.beginPath();
            ctx.arc(pixel.x, pixel.y, 10, 0, 2 * Math.PI);
            ctx.fillStyle = '#FFD700';
            ctx.fill();
            ctx.strokeStyle = '#DAA520';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Label
            ctx.font = 'bold 16px "Inter"';
            ctx.fillStyle = '#B8860B';
            ctx.fillText('G', pixel.x + 14, pixel.y - 12);
            
            // Coordenadas do baricentro
            ctx.font = '12px "Inter"';
            ctx.fillStyle = '#8B6914';
            ctx.fillText(`(${G.x.toFixed(2)}, ${G.y.toFixed(2)})`, pixel.x + 14, pixel.y + 5);
        }
        
        // Atualizar inputs a partir dos pontos
        function updateInputsFromPoints() {
            document.getElementById('xCoordA').value = points.A.x;
            document.getElementById('yCoordA').value = points.A.y;
            document.getElementById('xCoordB').value = points.B.x;
            document.getElementById('yCoordB').value = points.B.y;
            document.getElementById('xCoordC').value = points.C.x;
            document.getElementById('yCoordC').value = points.C.y;
        }
        
        // Ler pontos dos inputs
        function readPointsFromInputs() {
            points.A.x = parseFloat(document.getElementById('xCoordA').value) || 0;
            points.A.y = parseFloat(document.getElementById('yCoordA').value) || 0;
            points.B.x = parseFloat(document.getElementById('xCoordB').value) || 0;
            points.B.y = parseFloat(document.getElementById('yCoordB').value) || 0;
            points.C.x = parseFloat(document.getElementById('xCoordC').value) || 0;
            points.C.y = parseFloat(document.getElementById('yCoordC').value) || 0;
        }
        
        // Atualizar resultado
        function updateResult() {
            const G = calculateBaricenter();
            triangleResult.innerHTML = `
                <div style="margin: 10px 0;">
                    <strong>Baricentro G:</strong> 
                    <span style="color: #B8860B; font-size: 1.1em;">
                        (${G.x.toFixed(2)}, ${G.y.toFixed(2)})
                    </span>
                </div>
                <div style="font-size: 0.9em; color: #666;">
                    <p><strong>Fórmula:</strong> G = ((xA + xB + xC)/3, (yA + yB + yC)/3)</p>
                    <p><strong>Cálculo:</strong></p>
                    <p>x = (${points.A.x} + ${points.B.x} + ${points.C.x}) / 3 = ${G.x.toFixed(2)}</p>
                    <p>y = (${points.A.y} + ${points.B.y} + ${points.C.y}) / 3 = ${G.y.toFixed(2)}</p>
                </div>
            `;
        }
        
        // Renderização completa
        function render() {
            // Verificar se o triângulo está TOTALMENTE fora do plano visível
            // Um triângulo some completamente se TODOS os seus vértices estão fora dos limites
            // (não apenas se um ou dois estão fora)
            
            let isTotallyOutOfBounds = false;
            
            // Verificar se todos os vértices estão fora em uma mesma direção
            const allLeft = points.A.x < PLANE_LIMITS.xMin && points.B.x < PLANE_LIMITS.xMin && points.C.x < PLANE_LIMITS.xMin;
            const allRight = points.A.x > PLANE_LIMITS.xMax && points.B.x > PLANE_LIMITS.xMax && points.C.x > PLANE_LIMITS.xMax;
            const allBelow = points.A.y < PLANE_LIMITS.yMin && points.B.y < PLANE_LIMITS.yMin && points.C.y < PLANE_LIMITS.yMin;
            const allAbove = points.A.y > PLANE_LIMITS.yMax && points.B.y > PLANE_LIMITS.yMax && points.C.y > PLANE_LIMITS.yMax;
            
            if (allLeft || allRight || allBelow || allAbove) {
                isTotallyOutOfBounds = true;
            }
            
            drawCartesianPlane(ctx, CARTESIAN_CONFIG, centerX, centerY);
            
            if (triangleDrawn) {
                drawTriangle();
                drawPoints();
                drawBaricenter();
                updateResult();
                
                if (isTotallyOutOfBounds) {
                    drawInactiveOverlay(ctx, CARTESIAN_CONFIG.size, 'Triângulo fora do limite\n(-10 a 10)');
                }
            }
        }
        
        // Handler do botão de plotar
        function handlePlot() {
            readPointsFromInputs();
            
            // Verificar se os pontos estão dentro dos limites
            if (!isWithinLimits(points.A.x, points.A.y) || 
                !isWithinLimits(points.B.x, points.B.y) || 
                !isWithinLimits(points.C.x, points.C.y)) {
                alert(`Valores fora do limite permitido! Por favor, insira valores entre ${PLANE_LIMITS.xMin} e ${PLANE_LIMITS.xMax} para X e Y.`);
                return;
            }
            
            // Verificar se os pontos formam um triângulo válido (não colineares)
            const area = points.A.x * (points.B.y - points.C.y) + 
                        points.B.x * (points.C.y - points.A.y) + 
                        points.C.x * (points.A.y - points.B.y);
            
            if (Math.abs(area) < 0.001) {
                alert('Os pontos são colineares! Eles não formam um triângulo.');
                return;
            }
            
            triangleDrawn = true;
            render();
        }
        
        // Handler do botão de limpar
        function handleClear() {
            triangleDrawn = false;
            triangleResult.innerHTML = 'Aguardando pontos...';
            drawCartesianPlane(ctx, CARTESIAN_CONFIG, centerX, centerY);
        }
        
        // Handler do botão de resetar pontos
        function handleReset() {
            points = {
                A: { x: 0, y: 0 },
                B: { x: 4, y: 0 },
                C: { x: 2, y: 3 }
            };
            updateInputsFromPoints();
            triangleDrawn = true;
            render();
        }
        
        // Event listeners
        if (plotTriangleBtn) {
            plotTriangleBtn.addEventListener('click', handlePlot);
        }
        
        if (clearTriangleBtn) {
            clearTriangleBtn.addEventListener('click', handleClear);
        }
        
        if (resetPointsBtn) {
            resetPointsBtn.addEventListener('click', handleReset);
        }
        
        // Funções de manipulação do mouse/touch para arrastar pontos

        // Converte um evento de mouse OU touch em posição {x, y} relativa ao canvas
        function getEventPos(event) {
            const rect = canvas.getBoundingClientRect();
            const scaleXCanvas = canvas.width / rect.width;
            const scaleYCanvas = canvas.height / rect.height;

            let clientX, clientY;

            if (event.touches && event.touches.length > 0) {
                // Touch: usa o primeiro dedo
                clientX = event.touches[0].clientX;
                clientY = event.touches[0].clientY;
            } else {
                clientX = event.clientX;
                clientY = event.clientY;
            }

            return {
                x: (clientX - rect.left) * scaleXCanvas,
                y: (clientY - rect.top)  * scaleYCanvas
            };
        }
        
        function getPointAtPixel(pixelX, pixelY) {
            const pointLabels = ['A', 'B', 'C'];
            const pointCoords = [points.A, points.B, points.C];

            // Em touch usamos um threshold maior para facilitar o toque
            const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
            const threshold = isTouchDevice ? DRAG_THRESHOLD * 2.5 : DRAG_THRESHOLD;
            
            for (let i = 0; i < 3; i++) {
                const p = pointCoords[i];
                const pixel = toPixel(p.x, p.y, centerX, centerY, scale);
                const distance = Math.sqrt(Math.pow(pixelX - pixel.x, 2) + Math.pow(pixelY - pixel.y, 2));
                if (distance <= threshold) {
                    return pointLabels[i];
                }
            }
            return null;
        }

        // ── MOUSE ──────────────────────────────────────────────────────────────
        function handleMouseDown(event) {
            if (!triangleDrawn) return;
            const pos = getEventPos(event);
            const clickedPoint = getPointAtPixel(pos.x, pos.y);
            if (clickedPoint) {
                isDragging = true;
                draggedPoint = clickedPoint;
                canvas.style.cursor = 'grabbing';
            }
        }
        
        function handleMouseMove(event) {
            if (!isDragging || !draggedPoint) return;
            const pos = getEventPos(event);
            points[draggedPoint].x = Math.round(((pos.x - centerX) / scale) * 100) / 100;
            points[draggedPoint].y = Math.round(((centerY - pos.y) / scale) * 100) / 100;
            updateInputsFromPoints();
            render();
        }
        
        function handleMouseUp() {
            if (isDragging) {
                isDragging = false;
                draggedPoint = null;
                canvas.style.cursor = 'crosshair';
            }
        }
        
        function handleMouseLeave() {
            if (isDragging) {
                isDragging = false;
                draggedPoint = null;
                canvas.style.cursor = 'crosshair';
            }
        }

        // ── TOUCH ──────────────────────────────────────────────────────────────
        function handleTouchStart(event) {
            if (!triangleDrawn) return;
            const pos = getEventPos(event);
            const touchedPoint = getPointAtPixel(pos.x, pos.y);
            if (touchedPoint) {
                // Impede o scroll da página enquanto arrasta um ponto
                event.preventDefault();
                isDragging = true;
                draggedPoint = touchedPoint;
            }
        }

        function handleTouchMove(event) {
            if (!isDragging || !draggedPoint) return;
            event.preventDefault(); // Impede o scroll da página
            const pos = getEventPos(event);
            points[draggedPoint].x = Math.round(((pos.x - centerX) / scale) * 100) / 100;
            points[draggedPoint].y = Math.round(((centerY - pos.y) / scale) * 100) / 100;
            updateInputsFromPoints();
            render();
        }

        function handleTouchEnd() {
            if (isDragging) {
                isDragging = false;
                draggedPoint = null;
            }
        }
        
        // Adicionar eventos de mouse ao canvas
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('mouseleave', handleMouseLeave);

        // Adicionar eventos de touch ao canvas
        // { passive: false } é necessário para poder chamar preventDefault()
        canvas.addEventListener('touchstart',  handleTouchStart, { passive: false });
        canvas.addEventListener('touchmove',   handleTouchMove,  { passive: false });
        canvas.addEventListener('touchend',    handleTouchEnd);
        canvas.addEventListener('touchcancel', handleTouchEnd);
        
        // Inicializar com triângulo de exemplo
        updateInputsFromPoints();
        triangleDrawn = true;
        render();
    }

    // Inicializar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFourthPlane);
    } else {
        initFourthPlane();
    }
})();



// ============================================================================
// REDUÇÃO AUTOMÁTICA DE FONTE NAS FÓRMULAS KATEX
// ============================================================================

(function () {
    const MIN_FONT_EM = 0.4;   // menor tamanho permitido (em em)
    const STEP        = 0.05;  // decremento por iteração

    function fitFormulaFonts() {
        document.querySelectorAll('.formulas-box').forEach(function (box) {
            // container de referência para a largura disponível
            var container = box.closest('.boxes') || box.parentElement;
            if (!container) return;

            // O KaTeX renderiza dentro de um elemento .katex-display ou .katex
            // Precisamos do elemento que realmente tem o conteúdo renderizado
            var katexEl = box.querySelector('.katex-display') || box.querySelector('.katex');

            // Reseta para o tamanho padrão antes de medir
            box.style.fontSize = '';
            if (katexEl) katexEl.style.fontSize = '';

            // Largura disponível = largura interna do container (descontando padding)
            var available = container.clientWidth
                - parseFloat(getComputedStyle(container).paddingLeft  || 0)
                - parseFloat(getComputedStyle(container).paddingRight || 0);

            if (available <= 0) return;

            // Elemento a medir: o .katex interno, ou o próprio box se não houver KaTeX
            var measured = katexEl || box;

            // Tamanho atual em em (KaTeX usa font-size em em no elemento .katex)
            // Lemos o font-size computado do box em px e do katexEl em px para
            // calcular a proporção em em
            var currentEm = 1; // começa em 1em = tamanho do pai

            // Reduz enquanto o conteúdo ultrapassa a largura disponível
            while (measured.scrollWidth > available && currentEm > MIN_FONT_EM) {
                currentEm = Math.round((currentEm - STEP) * 1000) / 1000;
                box.style.fontSize = currentEm + 'em';
            }
        });
    }

    // Aguarda KaTeX terminar (ele roda no onload do auto-render)
    // Usamos MutationObserver para detectar quando os .katex aparecem no DOM,
    // com fallback em timeout crescente
    function waitForKatexAndFit() {
        var attempts = 0;
        var maxAttempts = 20;

        function tryFit() {
            attempts++;
            var katexEls = document.querySelectorAll('.katex');
            if (katexEls.length > 0) {
                fitFormulaFonts();
            } else if (attempts < maxAttempts) {
                setTimeout(tryFit, 150);
            }
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function () {
                setTimeout(tryFit, 200);
            });
        } else {
            setTimeout(tryFit, 200);
        }
    }

    waitForKatexAndFit();

    // Re-executa ao redimensionar (ex: rotação de tela)
    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(fitFormulaFonts, 150);
    });
})();

