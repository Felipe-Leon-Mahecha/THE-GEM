// Central runtime asset paths.
// Keep this file small and expand it as asset folders are reorganized.
(function () {
    const common = 'assets/UI/Common';
    const store = 'assets/UI/Store';

    window.GEM_ASSETS = {
        icons: {
            heart: `${common}/Icons/Corazon_Vida.png`,
            musicOn: `${common}/Icons/Music_On.png`,
            musicOff: `${common}/Icons/Music_Off.png`,
            options: `${common}/Icons/Opciones.png`,
            favicon: `${common}/Icons/favicon.png`
        },
        currency: {
            coins: `${common}/Currency/DEAD_COIN.png`,
            gems: `${common}/Currency/Rubies.png`
        },
        hud: {
            gravityUp: `${common}/HUD/Gravedad_arriba.png`,
            gravityDown: `${common}/HUD/Gravedad_abajo.png`,
            moveLeft: `${common}/HUD/Direccion_izquierda.png`,
            moveRight: `${common}/HUD/Direccion_derecha.png`
        },
        avatars: {
            default: `${common}/Avatars/Avatar_Default.png`,
            dxz: `${common}/Avatars/DXZ_Avatar.png`,
            fox: `${common}/Avatars/FOX_Avatar.png`,
            brifon: `${common}/Avatars/BRIFON_Avatar.png`,
            buhe: `${common}/Avatars/BUHE Avatar.png`
        },
        store: {
            placeholders: {
                item: `${store}/Placeholders/placeholder_store_item.png`,
                rubyPassReward: `${store}/Placeholders/placeholder_ruby_pass_reward.png`
            },
            trails: {
                root: `${store}/Trails`,
                covers: `${store}/Trails/Covers`
            },
            normalSkins: {
                root: `${store}/Skins/Normal`,
                balls: `${store}/Skins/Normal/Balls`,
                donuts: `${store}/Skins/Normal/Donuts`
            },
            vipBundles: `${store}/VIP/Bundles`
        },
        rewards: {
            gems: {
                large: `${common}/Rewards/Currency/Gems/Monton_de_gemas_grande.png`,
                medium: `${common}/Rewards/Currency/Gems/Monton_de_gemas_Mediano.png`,
                small: `${common}/Rewards/Currency/Gems/Monton_de_gemas_Pequeno.png`,
                single: `${common}/Rewards/Currency/Gems/Monojo_de_gemas.png`
            },
            coins: {
                large: `${common}/Rewards/Currency/Coins/Monton_de_monedas_grande.png`,
                medium: `${common}/Rewards/Currency/Coins/Monton_de_monedas_Mediano.png`,
                small: `${common}/Rewards/Currency/Coins/Monton_de_monedas_Pequeno.png`,
                single: `${common}/Rewards/Currency/Coins/Monojo_de_monedas.png`
            }
        },
        rankIcon(id) {
            return `${common}/Ranks/rango_${id}.png`;
        }
    };
})();
