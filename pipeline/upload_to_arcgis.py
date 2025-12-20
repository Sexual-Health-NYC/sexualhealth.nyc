"""
Upload GeoJSON to ArcGIS Online as a hosted feature layer.

Usage:
    python3 upload_to_arcgis.py

You will be prompted for your ArcGIS username and password.
"""

import getpass
import sys

try:
    from arcgis.gis import GIS
    from arcgis.features import FeatureLayer
except ImportError:
    print("❌ Error: arcgis package not installed")
    print("\nInstall it with:")
    print("  pip install arcgis")
    sys.exit(1)


def main():
    """Upload GeoJSON to ArcGIS Online."""

    geojson_path = 'data/export/sexual_health_clinics_verified.geojson'

    print("=" * 60)
    print("ArcGIS Online Upload - Sexual Health NYC Clinics")
    print("=" * 60)
    print()

    # Get credentials
    print("Enter your ArcGIS Online credentials:")
    username = input("Username: ").strip()
    password = getpass.getpass("Password: ")

    print("\n🔐 Authenticating...")

    try:
        # Connect to ArcGIS Online
        gis = GIS("https://arcgis.com", username, password)
        print(f"✅ Logged in as: {gis.users.me.username}")
        print(f"   Organization: {gis.properties.name if hasattr(gis, 'properties') else 'N/A'}")
    except Exception as e:
        print(f"❌ Authentication failed: {e}")
        sys.exit(1)

    print(f"\n📂 Preparing to upload: {geojson_path}")

    # Item properties
    item_properties = {
        'title': 'NYC Sexual Health Clinics',
        'description': 'Verified sexual health clinics in NYC with services including STI testing, HIV testing, PrEP, and PEP. Data collected from NYC Open Data and official health department sources.',
        'tags': 'sexual health, NYC, clinics, STI, HIV, PrEP, healthcare',
        'type': 'GeoJson',
        'overwrite': True  # Update if already exists
    }

    try:
        print("\n📤 Uploading GeoJSON...")

        # Upload the GeoJSON file
        item = gis.content.add(
            item_properties=item_properties,
            data=geojson_path
        )

        print(f"✅ Uploaded successfully!")
        print(f"   Item ID: {item.id}")
        print(f"   URL: {item.homepage}")

        # Publish as a hosted feature layer
        print("\n🗺️  Publishing as feature layer...")

        published_item = item.publish()

        print(f"✅ Published successfully!")
        print(f"   Layer ID: {published_item.id}")
        print(f"   Layer URL: {published_item.url}")

        print("\n" + "=" * 60)
        print("✅ UPLOAD COMPLETE")
        print("=" * 60)
        print()
        print("Next steps:")
        print("1. Go to your ArcGIS StoryMap editor")
        print("2. Add a Map block")
        print("3. Click 'Add layer' and search for 'NYC Sexual Health Clinics'")
        print("4. Configure popup and styling")
        print()
        print(f"Direct link to layer:")
        print(f"  {published_item.homepage}")

    except Exception as e:
        print(f"\n❌ Upload failed: {e}")
        print("\nTroubleshooting:")
        print("- Make sure you have permission to create content")
        print("- Check that the GeoJSON file exists")
        print("- Try the manual upload via ArcGIS Online web interface")
        sys.exit(1)


if __name__ == "__main__":
    main()
