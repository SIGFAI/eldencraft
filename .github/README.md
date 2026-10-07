# EldenCraft

Minecraft survival inside Elden Ring: gather, craft and build in the Lands Between, and fight its bosses with Minecraft weapons (offline).

**EldenCraft is made by [wargamereview-ship-it](https://github.com/wargamereview-ship-it).** All credit for the mod goes to them. It is built on [chasmlol/SkyCraft](https://github.com/chasmlol/SkyCraft) by ATStrategist (wargamereview-ship-it), chasmlol (SkyCraft, upstream of the Minecraft mod).

- Original project: https://github.com/wargamereview-ship-it/EldenCraft
- Report bugs and ask questions there: https://github.com/wargamereview-ship-it/EldenCraft/issues
- Upstream release packaged here: [0.3](https://github.com/wargamereview-ship-it/EldenCraft/releases/tag/0.3) (commit [`5e0cab1`](https://github.com/wargamereview-ship-it/EldenCraft/tree/5e0cab1da95a9d8f4955c5c1cc6a28f3de727f2f))

> **Beta.** Nobody at SIGF has played this build yet. Back up your saves.
> Bugs in the mod itself go to the author's issue tracker above; problems with the one-click install go to this repository's issues.

## What you need

- **Elden Ring** ([Steam](https://store.steampowered.com/app/1245620/)): exe 2.7.1 only (App Ver. 1.17.1).
- **Minecraft**: Java Edition 26.3.
- Windows and the [SIGF app](https://sigf.ai). The app installs me3 0.13.0, fabric-loader 0.19.5, fabric-api 0.161.0+26.3 for you.

## Install

In the SIGF app, open **EldenCraft** in the catalog, press **Install**, then **Play**. **Restore** puts your game folders back exactly as they were.
The app follows `mashup.json` in this repository: every download is pinned by sha256. The files come from the release [`v0.3.0`](../../releases/tag/v0.3.0).

### How to play

- Explore the Lands Between as a Minecraft player: gather, craft tools, build among the ruins and fight Elden Ring's enemies with Minecraft weapons.
- Press Play: a hidden Minecraft starts first, then Elden Ring offline. Load your character; Minecraft takes over movement once it has connected.
- Minecraft's keys move, mine, build and fight; E inventory. R uses doors, levers, items and Sites of Grace. Escape still opens Elden Ring's menu.
- F8 Minecraft's pause menu (options, GUI scale), F9 first-person camera, F10 hands control back to Elden Ring, F5 camera modes.
- Minecraft hearts are your health: at zero you die in Elden Ring and respawn at a grace. Bosses drop named gear and enchanted books once per world.

### Good to know

- You need Elden Ring on Steam at executable 2.7.1 (App Ver. 1.17.1; other versions are refused) and Minecraft: Java Edition. Steam must be running. Two games run at once: expect a heavy load on 16 GB of RAM.
- Offline only: me3 (shipped, Restore removes it) starts Elden Ring without Easy Anti-Cheat. Never take this game folder online. It plays on your normal Elden Ring save, offline: back it up first if you care about it.
- Early playable build: tested in play by the author on Linux/Proton only; newer rewards, wards and status effects are built but not fully played. Some players report crashes on the Minecraft camera (F8) with NVIDIA drivers.
- Single player. Report bugs to the author with eldencraft.log (ELDEN RING\EldenCraft\native) and Minecraft's latest.log; Restore leaves those logs.

## Offline only

me3 starts Elden Ring with `--online false` and the profile's `start_online = false`: no Easy Anti-Cheat, no FromSoftware online play. It runs on your normal save, offline. Never start this game folder online with the mod.

## What this repository holds

1. The upstream source tree at tag `0.3`, commit [`5e0cab1da95a9d8f4955c5c1cc6a28f3de727f2f`](https://github.com/wargamereview-ship-it/EldenCraft/tree/5e0cab1da95a9d8f4955c5c1cc6a28f3de727f2f), every file unchanged (same git blobs). Upstream's own `README.md` is there, unchanged; GitHub shows this file (`.github/README.md`) first.
2. Added by SIGF in the same commit: this file, and `sigf/` (the scripts that built the release assets, for reference: they run inside the SIGF repository).
3. `mashup.json`, the SIGF app recipe (the next commit).
4. The release `v0.3.0` (its tag is the first commit):

| Asset | Size | sha256 | What it is |
|---|---|---|---|
| `me3-windows-amd64.zip` | 7402971 B | `a8b693c574106f20532ab1e8b58b2452f37370679b938a884fe75f87f9b68c2b` | me3 0.13.0 (garyttierney), the official release file, unchanged (MIT OR Apache-2.0, sha256 `a8b693c5...8c2b`); unpacked into `ELDEN RING/EldenCraft/me3`, it starts Elden Ring offline without Easy Anti-Cheat. |
| `eldencraft-eldenring.zip` | 679939 B | `a05f570798e90657d5cee395b618ba2b1bf5cdafc09997e0eb88323a02439f5d` | upstream's `eldencraft.dll` from release `0.3`, unchanged (sha256 `39149b8d...fcef5`, its payload manifest hash), as `EldenCraft/native/eldencraft.dll`, the me3 profile `EldenCraft/eldencraft.me3` exactly as upstream's installer writes it, and upstream's LICENSE; into the Elden Ring folder. |
| `eldencraft.mrpack` | 459723 B | `1690120e0c7ddee0b00bec9ed50c027dad0c455451ae7d9d9552efaee511cac8` | the Minecraft side: upstream's `eldencraft.jar` from release `0.3`, unchanged (sha256 `21b69b52...9da4`), with EldenCraft's and SkyCraft's LICENSE, for Minecraft 26.3 with Fabric Loader 0.19.5; Fabric API 0.161.0+26.3 is a Modrinth download link, not stored here. |

The sha256 of every file inside the zips is in `mashup.json` (`contents`).

## Licenses

| Part | License | Where |
|---|---|---|
| EldenCraft (all of the upstream tree) | MIT, Copyright (c) 2026 ATStrategist; its Fabric mod derives from SkyCraft (MIT, chasmlol) | `LICENSE` |
| me3 0.13.0 (release asset) | MIT OR Apache-2.0 | https://github.com/garyttierney/me3 (`LICENSE-MIT`, `LICENSE-APACHE` inside the zip) |
| SkyCraft (upstream of the Fabric mod) | MIT, Copyright chasmlol | `licenses/skycraft-LICENSE.txt` in `eldencraft.mrpack` |
| Fabric API (downloaded from Modrinth by the app, not stored here) | Apache-2.0 | https://github.com/FabricMC/fabric |

## Why this repository exists

The SIGF app (https://sigf.ai) installs mods from recipes (`mashup.json`) whose downloads are pinned release files. This repository makes EldenCraft installable in one click, credited to wargamereview-ship-it. If you are the author and want anything changed or taken down, open an issue here.
