"""Convert a Vattalus cockpit FBX to a Draco-compressed GLB with PBR materials.

Usage (from Blender):
    blender --background --python scripts/convert-cockpit-fbx.py -- <input.fbx> <output.glb> <textures_dir>
"""
import bpy
import os
import sys

argv = sys.argv[sys.argv.index("--") + 1:]
input_fbx = os.path.abspath(argv[0])
output_glb = os.path.abspath(argv[1])
textures_dir = os.path.abspath(argv[2])


def clear_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    # Also purge orphans from any prior run
    for block in list(bpy.data.images):
        bpy.data.images.remove(block)
    for block in list(bpy.data.materials):
        bpy.data.materials.remove(block)


def add_tex(nodes, path, non_color=False):
    full = os.path.join(textures_dir, path)
    tex = nodes.new('ShaderNodeTexImage')
    tex.image = bpy.data.images.load(full)
    if non_color:
        tex.image.colorspace_settings.name = 'Non-Color'
    return tex


def setup_material(mat, albedo=None, metallic=None, roughness=None, normal=None, emissive=None, glass=False):
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links

    # Remove everything except output, then add a fresh Principled BSDF.
    for node in list(nodes):
        if node.type != 'OUTPUT_MATERIAL':
            nodes.remove(node)
    output = next((n for n in nodes if n.type == 'OUTPUT_MATERIAL'), None)
    if output is None:
        output = nodes.new('ShaderNodeOutputMaterial')

    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    bsdf.location = (-220, 0)
    output.location = (100, 0)
    links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])

    if albedo:
        t = add_tex(nodes, albedo)
        links.new(t.outputs['Color'], bsdf.inputs['Base Color'])
        if glass and 'Alpha' in t.outputs:
            links.new(t.outputs['Alpha'], bsdf.inputs['Alpha'])
    if metallic:
        t = add_tex(nodes, metallic, non_color=True)
        links.new(t.outputs['Color'], bsdf.inputs['Metallic'])
    if roughness:
        t = add_tex(nodes, roughness, non_color=True)
        links.new(t.outputs['Color'], bsdf.inputs['Roughness'])
    if normal:
        t = add_tex(nodes, normal, non_color=True)
        nm = nodes.new('ShaderNodeNormalMap')
        links.new(t.outputs['Color'], nm.inputs['Color'])
        links.new(nm.outputs['Normal'], bsdf.inputs['Normal'])
    if emissive:
        t = add_tex(nodes, emissive)
        # Blender 3.x/4.x: use "Emission Color" if present, else "Emission".
        for key in ('Emission Color', 'Emission'):
            if key in bsdf.inputs:
                links.new(t.outputs['Color'], bsdf.inputs[key])
                break
        if 'Emission Strength' in bsdf.inputs:
            bsdf.inputs['Emission Strength'].default_value = 1.0

    if glass:
        if hasattr(mat, 'blend_method'):
            mat.blend_method = 'BLEND'
        if hasattr(mat, 'shadow_method'):
            mat.shadow_method = 'NONE'
        if hasattr(mat, 'surface_render_method'):
            # Blender 4.2+ replaces blend_method with surface_render_method
            mat.surface_render_method = 'BLENDED'


def main():
    clear_scene()
    bpy.ops.import_scene.fbx(filepath=input_fbx)

    body_texset = dict(
        albedo='body_albedo.png',
        metallic='body_metallic.png',
        roughness='body_roughness.png',
        normal='body_normal.png',
        emissive='body_emissive.png',
    )
    glass_texset = dict(
        albedo='glass_albedo.png',
        metallic='glass_metallic.png',
        roughness='glass_roughness.png',
    )

    # Group object names that get Body texset. Vattalus pack names them Body / Joystick /
    # ThrottleControl / Glass (+ Seat on the _with_seat variant); FBX import sometimes
    # prefixes or suffixes with numeric indices so we match by startswith.
    body_prefixes = ('Body', 'Joystick', 'ThrottleControl', 'Seat')
    glass_prefixes = ('Glass',)

    seen_body_mats = set()
    seen_glass_mats = set()

    for obj in list(bpy.data.objects):
        if obj.type != 'MESH' or not obj.data.materials:
            continue
        name = obj.name
        is_body = any(name.startswith(p) for p in body_prefixes)
        is_glass = any(name.startswith(p) for p in glass_prefixes)
        if not (is_body or is_glass):
            continue
        for slot in obj.material_slots:
            mat = slot.material
            if mat is None:
                continue
            if is_glass and mat.name not in seen_glass_mats:
                setup_material(mat, glass=True, **glass_texset)
                seen_glass_mats.add(mat.name)
            elif is_body and mat.name not in seen_body_mats:
                setup_material(mat, **body_texset)
                seen_body_mats.add(mat.name)

    # Apply transforms so scale/rotation are baked into the mesh.
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)

    bpy.ops.export_scene.gltf(
        filepath=output_glb,
        export_format='GLB',
        export_draco_mesh_compression_enable=True,
        export_draco_mesh_compression_level=6,
        export_texcoords=True,
        export_normals=True,
        export_materials='EXPORT',
        export_image_format='AUTO',
        export_apply=True,
    )

    print(f"[convert-cockpit-fbx] {input_fbx} -> {output_glb}")


main()
