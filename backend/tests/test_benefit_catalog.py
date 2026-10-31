"""Integrità del catalogo condiviso, senza rete né dati personali."""
import json
from pathlib import Path
import unittest
ROOT = Path(__file__).resolve().parents[2]

class BenefitCatalogTest(unittest.TestCase):
    def setUp(self):
        self.data = json.loads((ROOT/'src/content/benefici.json').read_text())
    def test_unique_ids_and_inail_is_view_of_same_items(self):
        items = self.data['benefits']
        self.assertEqual(len(items), len({b['id'] for b in items}))
        self.assertEqual(len(items), 12)
        self.assertTrue(all('inail' in b['paths'] for b in items))
    def test_no_automatic_eligibility(self):
        for b in self.data['benefits']:
            self.assertEqual(b['eligibility'], 'da_verificare')
            self.assertTrue(b['checks'])
            self.assertTrue(b['nextStep'])
    def test_traceable_sources_and_local_exception(self):
        for b in self.data['benefits']:
            if b['id'] != 'contributi-locali':
                self.assertTrue(b['sourceIds'])
            for id in b['sourceIds']:
                self.assertTrue(self.data['sources'][id]['url'].startswith('https://'))
    def test_category_filter(self):
        mobility = [b['id'] for b in self.data['benefits'] if b['category']=='mobilita']
        self.assertEqual(set(mobility), {'veicoli','contrassegno'})

if __name__ == '__main__': unittest.main()
