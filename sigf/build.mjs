// EldenCraft (wargamereview-ship-it / ATStrategist, MIT): Minecraft survival, building and combat inside Elden Ring.
// Passthrough: a Rust DLL (eldencraft.dll, loaded by me3) links over the shared memory Local\EldenCraft_v1 to a hidden
// Minecraft 26.3 (Fabric mod eldencraft, a SkyCraft descendant). Rehosted on SIGFAI/eldencraft (MIT) from the upstream
// release 0.3 (EldenCraft-0.3-Windows-Setup.zip), payload files unchanged:
//   - eldencraft-eldenring.zip into {game} (the ELDEN RING folder): EldenCraft/native/eldencraft.dll and
//     EldenCraft/eldencraft.me3, the exact profile upstream's installer writes (start_online = false, natives
//     "native/eldencraft.dll"), plus upstream's LICENSE.
//   - me3 0.13.0 (garyttierney, MIT OR Apache-2.0), the official me3-windows-amd64.zip unchanged (the file upstream's
//     dependencies.json pins), into {game}/EldenCraft/me3: the launch exe must sit inside the game folder.
//   - eldencraft.mrpack: Minecraft 26.3 + Fabric Loader 0.19.5, upstream's eldencraft.jar unchanged, Fabric API
//     0.161.0+26.3 from Modrinth, EldenCraft's and SkyCraft's LICENSE. JVM args as upstream's instance.cfg
//     (-Deldencraft.startHidden=true, 4 GB max); its --enable-native-access is not on the app's whitelist (Java 25
//     only warns).
// Launch: Minecraft first (no port: shared memory), then me3 as upstream's installer runs it
// (`me3 launch -g eldenring -p <profile> -e <eldenring.exe> --online false`): Easy Anti-Cheat off, offline only.
// The DLL then finds javaw.exe running and does not try to start upstream's own portable Prism.
//   node library/eldencraft/build.mjs                    (outputs: library/lib.mjs)
import { mrpack, resolveFabricApi, unzip } from '../../orchestrator/src/recipe.js';
import { asset, card, dl, emit, pinned, player, rawAt, zipAsset } from '../lib.mjs';

const UP = {
  repo: 'https://github.com/wargamereview-ship-it/EldenCraft', tag: '0.3', commit: '5e0cab1da95a9d8f4955c5c1cc6a28f3de727f2f',
  license: 'MIT', authors: ['ATStrategist (wargamereview-ship-it)'],
  zip: { file: 'EldenCraft-0.3-Windows-Setup.zip', sha256: '44dff92be5001fa889124ccccc1b9375c5cf13b203a480abf1247044866a7326' }, // = GitHub digest + SHA256SUMS.txt, 2026-10-07
  dll: { path: 'EldenCraft-Setup/payload/eldencraft.dll', sha256: '39149b8d5d4881758e8e89fe27eaf8dd048045b2c0e1be106d57dfb3875fcef5' }, // = payload/manifest.json
  jar: { path: 'EldenCraft-Setup/payload/eldencraft.jar', sha256: '21b69b520ae799ce3329bf12fa5f46e25dbe2f05e9b10bb75d5842dbf4589da4' }, // = payload/manifest.json
};
export const ME3 = {
  id: 'me3', version: '0.13.0', license: 'MIT OR Apache-2.0', repo: 'https://github.com/garyttierney/me3',
  commit: '989b522214e39c83d701f4182c4f0a86ad79a30a', // tag v0.13.0
  file: 'me3-windows-amd64.zip', url: 'https://github.com/garyttierney/me3/releases/download/v0.13.0/me3-windows-amd64.zip',
  sha256: 'a8b693c574106f20532ab1e8b58b2452f37370679b938a884fe75f87f9b68c2b', // GitHub release digest = upstream dependencies.json pin
};
const SKYCRAFT = { repo: 'https://github.com/chasmlol/SkyCraft', commit: 'bfcaf178524b92c2cdeb88e4ce0f13ef9ded6f32' }; // v0.1.2
const MC = { mc: '26.3', loader: '0.19.5', fabricApi: '0.161.0+26.3', java: '25' }; // payload/manifest.json
const ID = 'eldencraft', VERSION = '0.3.0', NAME = 'EldenCraft';
const TAGLINE = 'Minecraft survival inside Elden Ring: gather, craft and build in the Lands Between, and fight its bosses with Minecraft weapons (offline).';
// Upstream installer's profile, byte for byte (installer/setup.py install()).
const PROFILE = 'profileVersion = "v1"\nstart_online = false\n\n[[supports]]\ngame = "eldenring"\n\n[[natives]]\npath = "native/eldencraft.dll"\n';

const up = new Map(unzip(await pinned(`${UP.repo}/releases/download/${UP.tag}/${UP.zip.file}`, UP.zip.sha256)).map(e => [e.name.replace(/\\/g, '/'), e.data]));
for (const f of [UP.dll.path, UP.jar.path, 'EldenCraft-Setup/LICENSE']) if (!up.has(f)) throw new Error(`${UP.zip.file} has no ${f}`);
const license = up.get('EldenCraft-Setup/LICENSE');
const er = zipAsset(`${ID}-eldenring.zip`, [
  { name: 'EldenCraft/native/eldencraft.dll', data: up.get(UP.dll.path) },
  { name: 'EldenCraft/eldencraft.me3', data: Buffer.from(PROFILE) },
  { name: 'EldenCraft/LICENSE.txt', data: license },
]);
if (!er.contents.some(c => c.path === 'EldenCraft/native/eldencraft.dll' && c.sha256 === UP.dll.sha256)) throw new Error('eldencraft.dll hash differs from the reviewed build');
const me3 = asset(ME3.file, await pinned(ME3.url, ME3.sha256), { zipped: true });
const jar = up.get(UP.jar.path);
const skyLicense = await rawAt(SKYCRAFT.repo, SKYCRAFT.commit, 'LICENSE');
const pack = async (offline) => {
  const fabricApi = offline ? null : await resolveFabricApi(MC.fabricApi, MC.mc);
  if (!offline && !fabricApi?.download) throw new Error(`Fabric API ${MC.fabricApi} not resolved on Modrinth`);
  return asset(`${ID}.mrpack`, mrpack({ name: NAME, summary: TAGLINE, versions: MC, versionId: VERSION, fabricApi,
    jars: [{ name: 'eldencraft.jar', data: jar }],
    extra: [{ name: 'overrides/licenses/eldencraft-LICENSE.txt', data: license }, { name: 'overrides/licenses/skycraft-LICENSE.txt', data: skyLicense }] }));
};
const assets = [me3, er, await pack(false)];

const make = (urls, set) => {
  const mp = set.find(a => a.name.endsWith('.mrpack'));
  return {
    id: `sigf/${ID}`,
    version: VERSION,
    name: NAME,
    tagline: player(ID).tagline ?? TAGLINE,
    how_to_play: player(ID).howToPlay,
    kind: 'passthrough',
    games: [
      { game: 'eldenring', role: 'host', label: 'Elden Ring', engine: 'Elden Ring (FromSoftware, D3D12) + me3 native DLL eldencraft (Rust, fromsoftware-rs 59fbd3b)', apps: { steam: '1245620' }, runtime: 'exe 2.7.1 only (App Ver. 1.17.1)' },
      { game: 'minecraft', role: 'guest', label: 'Minecraft', engine: 'Minecraft Java 26.3 + Fabric mod eldencraft (Java)', mc: MC.mc, loader: `fabric@${MC.loader}`, java: MC.java },
    ],
    requires: [
      { id: ME3.id, version: ME3.version, license: `${ME3.license}, shipped unchanged`, page: `${ME3.repo}/releases/tag/v${ME3.version}`,
        note: 'installed into ELDEN RING/EldenCraft/me3 by the app; it starts Elden Ring offline without Easy Anti-Cheat', source: { url: urls[me3.name], sha256: me3.sha256 } },
      { id: 'fabric-loader', version: MC.loader },
      { id: 'fabric-api', version: MC.fabricApi, note: 'in the Minecraft pack (downloaded from Modrinth)' },
    ],
    install: [
      { game: 'eldenring', strategy: 'game-dir-snapshot', loader: 'me3', files: [
        { src: me3.name, dst: '{game}/EldenCraft/me3', unpack: true, contents: me3.contents, ...dl(me3, urls) },
        { src: er.name, dst: '{game}', unpack: true, contents: er.contents, ...dl(er, urls) },
      ] },
      { game: 'minecraft', strategy: 'mrpack', jvm_args: ['-Deldencraft.startHidden=true', '-Xmx4G'], pack: { src: mp.name, ...dl(mp, urls) } },
    ],
    launch: [
      { game: 'minecraft' },
      { game: 'eldenring', exe: 'EldenCraft/me3/bin/me3.exe',
        args: ['launch', '-g', 'eldenring', '-p', '{game}/EldenCraft/eldencraft.me3', '-e', '{game}/Game/eldenring.exe', '--online', 'false'] },
    ],
    files: set.map(a => ({ name: a.name, ...dl(a, urls) })),
    source: {
      repo: UP.repo, license: 'MIT AND (MIT OR Apache-2.0)', upstream_license: UP.license, tag: UP.tag, commit: UP.commit,
      hosted: `https://github.com/SIGFAI/${ID}`,
      based_on: SKYCRAFT.repo,
      bundled: [{ name: 'me3', version: ME3.version, repo: ME3.repo, commit: ME3.commit, license: ME3.license }],
    },
    media: {},
    built_by: { author: 'wargamereview-ship-it', authors: [...UP.authors, 'chasmlol (SkyCraft, upstream of the Minecraft mod)'], packaged_by: 'SIGF' },
    idea_by: 'wargamereview-ship-it',
    built_at: '2026-10-07T00:00:00.000Z',
    // Never installed together (the app refuses either order): Minecraft-Ring's dinput8.dll proxy loads into every Elden Ring start, me3's included.
    conflicts: ['sigf/minecraft-ring'],
    ...card(UP.repo),
    notes: player(ID).notes,
  };
};

emit({ slug: ID, version: VERSION, assets, make });
