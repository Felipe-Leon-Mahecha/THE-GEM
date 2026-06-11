// =====================================================
// FRAGMENT SYSTEM - Skins y Emotes
// =====================================================

const FRAGMENT_STORAGE_KEY = 'fragmentCollection';

// Configuración de fragmentos para skins y emotes
const FRAGMENT_CONFIG = {
    // Skins que se pueden desbloquear por fragmentos
    skins: [
        { id: 'daxor', name: 'DAXOR', type: 'skin', rarity: 'DEMON', image: 'assets/UI/Store/Skins/Normal/DAXOR Skin DEMON/DAXOR_Skin_lado.png' },
        { id: 'kenji', name: 'KENJI', type: 'skin', rarity: 'EPICA', image: 'assets/UI/Store/Skins/Normal/KENJI Skin EPICO/Kenji_Skin_lado.png' },
        { id: 'brifon', name: 'BRIFON', type: 'skin', rarity: 'EPICA', image: 'assets/UI/Store/Skins/Normal/BRIFON Skin EPICO/BRIFON_Skin_lado.png' },
        { id: 'skin_caballero_dorado', name: 'Caballero Dorado', type: 'skin', rarity: 'VIP', image: 'assets/UI/Store/VIP/Bundles/Royal/skin_caballero_dorado.png' },
        { id: 'skin_reina', name: 'Reina', type: 'skin', rarity: 'VIP', image: 'assets/UI/Store/VIP/Bundles/Royal/skin_reina.png' },
        { id: 'skin_emperador_oscuro', name: 'Principe Oscuro', type: 'skin', rarity: 'VIP', image: 'assets/UI/Store/VIP/Bundles/Royal/skin_emperador_oscuro.png' },
        { id: 'skin_fantasma', name: 'Fantasma', type: 'skin', rarity: 'VIP', image: 'assets/UI/Store/VIP/Bundles/Monsters/skin_fantasma.png' },
        { id: 'skin_limon_toxico', name: 'Limon', type: 'skin', rarity: 'VIP', image: 'assets/UI/Store/VIP/Bundles/Food/skin_limon_toxico.png' },
        { id: 'skin_planeta_marte', name: 'Marte', type: 'skin', rarity: 'VIP', image: 'assets/UI/Store/VIP/Bundles/Space/skin_planeta_marte.png' },
        { id: 'skin_planeta_tierra', name: 'Tierra', type: 'skin', rarity: 'VIP', image: 'assets/UI/Store/VIP/Bundles/Space/skin_planeta_tierra.png' },
        { id: 'skin_cuervo', name: 'Cuervo', type: 'skin', rarity: 'VIP', image: 'assets/UI/Store/VIP/Bundles/Wild/skin_cuervo.png' },
        { id: 'skin_mama_claus', name: 'Mama Claus', type: 'skin', rarity: 'VIP', image: 'assets/UI/Store/VIP/Bundles/Christmas/skin_mama_claus.png' }
    ],
    // Emotes que se pueden desbloquear por fragmentos
    emotes: [
        { id: 'emote_risa', name: 'Risa', type: 'emote', rarity: 'ESPECIAL', image: 'assets/UI/Efectos de trails/Particulas/particula_risa.png' },
        { id: 'emote_risa_malvada', name: 'Risa Malvada', type: 'emote', rarity: 'EPICA', image: 'assets/UI/Efectos de trails/Particulas/particula_risa_malvada.png' }
    ]
};

// Sistema de fragmentos
let fragmentSystem = {
    // Colección de fragmentos del jugador
    collection: {},
    
    // Inicializar sistema
    init() {
        // RESET DE PRUEBA DESACTIVADO - Tu progreso ahora es permanente
        // this.resetAllForTesting();
        
        this.loadCollection();
        this.syncWithGlobalInventory();
    },

    // Sincronizar items desbloqueados con el inventario global al iniciar
    syncWithGlobalInventory() {
        this.getAllItems().forEach(item => {
            if (this.isItemUnlocked(item.id)) {
                const storageKey = item.type === 'skin' ? `skin_${item.id}` : `emote_${item.id}`;
                if (localStorage.getItem(storageKey) !== 'true') {
                    localStorage.setItem(storageKey, 'true');
                    console.log(`Sincronizado item desbloqueado: ${item.id}`);
                }
            }
        });
    },

    // Reset total para pruebas (Skins, Emotes y Fragmentos)
    resetAllForTesting() {
        console.log("Reiniciando todo para pruebas...");
        this.collection = {};
        this.saveCollection();
        
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('skin_') && key !== 'skin_cyan') localStorage.removeItem(key);
            if (key.startsWith('emote_')) localStorage.removeItem(key);
            if (key.startsWith('vip_item_')) localStorage.removeItem(key);
        });
        console.log("Reset completado.");
    },

    // Resetear todo el progreso de fragmentos
    resetAllProgress() {
        this.collection = {};
        this.saveCollection();
    },
    
    // Cargar colección desde localStorage
    loadCollection() {
        try {
            const saved = localStorage.getItem(FRAGMENT_STORAGE_KEY);
            if (saved) {
                this.collection = JSON.parse(saved);
            } else {
                this.collection = {};
            }
        } catch (e) {
            console.error('Error al cargar fragmentos:', e);
            this.collection = {};
        }
    },
    
    // Guardar colección en localStorage
    saveCollection() {
        localStorage.setItem(FRAGMENT_STORAGE_KEY, JSON.stringify(this.collection));
    },
    
    // Añadir un fragmento a un item
    addFragment(itemId, fragmentIndex) {
        if (!this.collection[itemId]) {
            this.collection[itemId] = { fragments: [], unlocked: false };
        }
        
        const item = this.collection[itemId];
        
        // Evitar duplicados
        if (item.fragments.includes(fragmentIndex)) {
            return { success: false, message: 'Ya tienes este fragmento' };
        }
        
        item.fragments.push(fragmentIndex);
        
        // Verificar desbloqueo completo
        if (item.fragments.length >= 4) {
            item.unlocked = true;
            
            // Marcar como poseído inmediatamente
            const info = this.getItemInfo(itemId);
            if (info) {
                const storageKey = info.type === 'skin' ? `skin_${itemId}` : `emote_${itemId}`;
                localStorage.setItem(storageKey, 'true');
            }
            
            this.saveCollection();
            // Notificar a la tienda que actualice su vista si está abierta
            if (window.SKINS_DATA) window.SKINS_DATA = window.getAllShopSkins?.() || window.SKINS_DATA;
            
            return { success: true, unlocked: true, itemId };
        }
        
        this.saveCollection();
        return { success: true, unlocked: false, fragmentIndex, totalFragments: item.fragments.length };
    },
    
    // Verificar si un item está desbloqueado
    isItemUnlocked(itemId) {
        return this.collection[itemId]?.unlocked || false;
    },
    
    // Obtener información de un item
    getItemInfo(itemId) {
        const allItems = [...FRAGMENT_CONFIG.skins, ...FRAGMENT_CONFIG.emotes];
        return allItems.find(item => item.id === itemId);
    },
    
    // Obtener todos los items disponibles
    getAllItems() {
        return [...FRAGMENT_CONFIG.skins, ...FRAGMENT_CONFIG.emotes];
    },
    
    // Obtener progreso de fragmentos de un item (0-4)
    getFragmentProgress(itemId) {
        const item = this.collection[itemId];
        return item ? item.fragments.length : 0;
    },
    
    // Obtener array de 4 posiciones indicando qué fragmentos tiene (true/false)
    getFragmentArray(itemId) {
        const item = this.collection[itemId];
        const array = [false, false, false, false];
        if (item && item.fragments) {
            item.fragments.forEach(index => {
                if (index >= 0 && index < 4) array[index] = true;
            });
        }
        return array;
    }
};

// Notificaciones y funciones globales
function showFragmentNotification(itemId, fragmentIndex, totalFragments) {
    const itemInfo = fragmentSystem.getItemInfo(itemId);
    if (!itemInfo) return;
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 40000;
        background: linear-gradient(135deg, #140f23fa, #0a0814fc);
        border: 2px solid #FFD70080; border-radius: 12px; padding: 16px 20px;
        display: flex; align-items: center; gap: 16px; transform: translateX(400px);
        transition: transform 0.3s, opacity 0.3s; opacity: 0; box-shadow: 0 0 40px #FFD70066;
    `;
    
    notification.innerHTML = `
        <div style="font-size: 36px; filter: drop-shadow(0 0 12px #FFD70099);">🧩</div>
        <div style="display: flex; flex-direction: column; gap: 4px;">
            <strong style="color: gold; letter-spacing: 2px; font-family: Geom, monospace; font-size: 12px;">FRAGMENTO</strong>
            <span style="color: white; font-family: monospace; font-size: 14px;">¡Has ganado fragmento de ${itemInfo.name}!</span>
            <span style="color: rgba(255,255,255,0.6); font-family: monospace; font-size: 11px;">Progreso: ${totalFragments}/4</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => { notification.style.transform = 'translateX(0)'; notification.style.opacity = '1'; }, 100);
    window.playSfx?.('reward', 0.7);
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)'; notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

function showItemUnlockedNotification(itemId) {
    const itemInfo = fragmentSystem.getItemInfo(itemId);
    if (!itemInfo) return;
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 40000;
        background: linear-gradient(135deg, #1a152e, #0a0814);
        border: 2px solid #FFD700; border-radius: 16px; padding: 20px;
        display: flex; align-items: center; gap: 20px; transform: translateX(450px);
        transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s;
        opacity: 0; box-shadow: 0 0 50px rgba(255, 215, 0, 0.3); min-width: 300px;
    `;
    
    const imageHtml = itemInfo.image ? 
        `<div style="width: 60px; height: 60px; background: rgba(255,215,0,0.1); border: 1px solid #FFD70044; border-radius: 12px; display: grid; place-items: center; overflow: hidden;">
            <img src="${itemInfo.image}" style="width: 80%; height: 80%; object-fit: contain;">
        </div>` : `<div style="font-size: 40px;">🎉</div>`;

    notification.innerHTML = `
        ${imageHtml}
        <div style="display: flex; flex-direction: column; gap: 4px;">
            <strong style="color: gold; letter-spacing: 3px; font-family: Geom, monospace; font-size: 13px; text-transform: uppercase;">¡DESBLOQUEADO!</strong>
            <span style="color: white; font-family: monospace; font-size: 16px; font-weight: bold;">${itemInfo.name}</span>
            <span style="color: rgba(255,255,255,0.6); font-family: monospace; font-size: 11px;">Ya disponible en tu inventario</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => { notification.style.transform = 'translateX(0)'; notification.style.opacity = '1'; }, 100);
    window.playSfx?.('reward', 0.9);
    setTimeout(() => {
        notification.style.transform = 'translateX(450px)'; notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 400);
    }, 6000);
}

function grantRandomFragment() {
    const availableItems = fragmentSystem.getAllItems().filter(item => !fragmentSystem.isItemUnlocked(item.id));
    if (availableItems.length === 0) return { success: false, message: 'Ya tienes todos los fragmentos' };
    
    const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
    const fragmentArray = fragmentSystem.getFragmentArray(randomItem.id);
    const availableIndices = fragmentArray.map((has, i) => has ? -1 : i).filter(i => i >= 0);
    const realRandomIdx = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    
    const result = fragmentSystem.addFragment(randomItem.id, realRandomIdx);
    if (result.success) {
        if (result.unlocked) showItemUnlockedNotification(randomItem.id);
        else showFragmentNotification(randomItem.id, realRandomIdx, result.totalFragments);
    }
    return result;
}

function grantSpecificFragment(itemId, index) {
    const result = fragmentSystem.addFragment(itemId, index);
    if (result.success) {
        if (result.unlocked) showItemUnlockedNotification(itemId);
        else showFragmentNotification(itemId, index, result.totalFragments);
    }
    return result;
}

// Renderización de UI
function renderFragmentProgressBar(itemId) {
    const progress = fragmentSystem.getFragmentProgress(itemId);
    const fragmentArray = fragmentSystem.getFragmentArray(itemId);
    const isUnlocked = fragmentSystem.isItemUnlocked(itemId);
    
    if (isUnlocked) {
        return `<div style="width:100%; height:26px; background:rgba(0,255,231,0.1); border:1px solid rgba(0,255,231,0.3); border-radius:8px; display:flex; align-items:center; justify-content:center; gap:3px; padding:3px;">
            ${fragmentArray.map(() => `<div style="flex:1; height:100%; background:#00ffe7; border-radius:4px;"></div>`).join('')}
            <span style="color:#00ffe7; font-family:Geom; font-size:11px; font-weight:bold; margin-left:4px;">✓</span>
        </div>`;
    }
    
    return `<div style="width:100%; height:26px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:8px; display:flex; align-items:center; justify-content:center; gap:3px; padding:3px; position:relative;">
        ${fragmentArray.map(has => `<div style="flex:1; height:100%; background:${has ? 'linear-gradient(to bottom, #FFD700, #b8860b)' : 'rgba(255,255,255,0.05)'}; border-radius:4px;"></div>`).join('')}
        <div style="position:absolute; width:100%; height:100%; display:flex; align-items:center; justify-content:center; pointer-events:none;">
            <span style="color:${progress > 0 ? '#FFD700' : 'rgba(255,255,255,0.4)'}; font-family:Geom; font-size:10px; font-weight:bold;">${progress}/4</span>
        </div>
    </div>`;
}

function isFragmentItem(itemId) {
    return fragmentSystem.getAllItems().some(item => item.id === itemId);
}

// Inicialización
fragmentSystem.init();

// Exportación
window.fragmentSystem = fragmentSystem;
window.grantRandomFragment = grantRandomFragment;
window.grantSpecificFragment = grantSpecificFragment;
window.showFragmentNotification = showFragmentNotification;
window.showItemUnlockedNotification = showItemUnlockedNotification;
window.renderFragmentProgressBar = renderFragmentProgressBar;
window.isFragmentItem = isFragmentItem;
