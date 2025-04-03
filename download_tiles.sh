#!/bin/bash

z=8  # Zoom level
x_start=206
x_end=208
y_start=115
y_end=116
output_dir="tiles_hoangsa"

# Tọa độ địa lý của Hoàng Sa (kinh độ, vĩ độ)
latitude=16.652315101880536
longitude=112.70436319457637

mkdir -p $output_dir

for ((x=$x_start; x<=$x_end; x++)); do
    for ((y=$y_start; y<=$y_end; y++)); do
        tile_url="https://tile.openstreetmap.org/$z/$x/$y.png"
        output_file="$output_dir/${z}_${x}_${y}.png"

        echo "📥 Đang tải: $tile_url -> $output_file"
        curl -s -o "$output_file" "$tile_url"
    done
done

echo "✅ Đã tải xong tất cả tiles ở Zoom $z!"
