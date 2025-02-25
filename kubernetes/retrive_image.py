import re

def get_images_from_yaml(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
        images = re.findall(r'image:\s*([^\s]+)', content)
        return images

def main():
    file_path = 'opentelemetry-demo-copy-2.yaml'  # Replace with your YAML file path
    images = get_images_from_yaml(file_path)
    # remove `""` and deduplicate
    images = list(sorted(set([re.sub(r'[\"\']', '', image) for image in images])))
    with open('image_list.txt', 'a') as output_file: 
        for image in images:
            output_file.write(image + '\n')

if __name__ == "__main__":
    main()
