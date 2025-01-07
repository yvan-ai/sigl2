import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import JournalDeFormationForm from '../components/CreateJournauxForm';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Création d'un mock pour axios
const mockAxios = new MockAdapter(axios);

describe('JournalDeFormationForm', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  test('renders the form with autocomplete inputs', () => {
    render(<JournalDeFormationForm />);

    // Vérifier que les éléments du formulaire sont affichés
    expect(screen.getByText('Créer un Journal de Formation')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Rechercher un groupe')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Rechercher un semestre')).toBeInTheDocument();
  });

  test('displays suggestions in autocomplete when typing in the input', async () => {
    // Mock de la réponse de l'API pour l'autocomplétion du groupe
    mockAxios.onGet('http://127.0.0.1:8000/utilisateurs/GroupesAutoCompletionView/').reply(200, [
      { id: 1, nom_groupe: 'Groupe A' },
      { id: 2, nom_groupe: 'Groupe B' },
    ]);

    render(<JournalDeFormationForm />);

    // Simuler la saisie dans le champ de recherche
    userEvent.type(screen.getByPlaceholderText('Rechercher un groupe'), 'Groupe');

    // Vérifier que les suggestions sont affichées
    await waitFor(() => expect(screen.getByText('Groupe A')).toBeInTheDocument());
    expect(screen.getByText('Groupe B')).toBeInTheDocument();
  });

  test('selecting a suggestion updates the input value and calls onSelect', async () => {
    mockAxios.onGet('http://127.0.0.1:8000/utilisateurs/GroupesAutoCompletionView/').reply(200, [
      { id: 1, nom_groupe: 'Groupe A' },
    ]);

    render(<JournalDeFormationForm />);

    userEvent.type(screen.getByPlaceholderText('Rechercher un groupe'), 'Groupe');

    await waitFor(() => expect(screen.getByText('Groupe A')).toBeInTheDocument());

    userEvent.click(screen.getByText('Groupe A'));

    // Vérifier que le champ d'entrée est mis à jour avec la valeur sélectionnée
    expect(screen.getByPlaceholderText('Rechercher un groupe').value).toBe('Groupe A');
  });

  test('submits the form with valid data', async () => {
    // Mock de la réponse de l'API pour la soumission du formulaire
    mockAxios.onPost('http://127.0.0.1:8000/utilisateurs/journaux/creer/').reply(200, {
      message: 'Journal de formation créé avec succès',
    });
    mockAxios.onGet('http://127.0.0.1:8000/utilisateurs/GroupesAutoCompletionView/').reply(200, [
      { id: 1, nom_groupe: 'Groupe A' },
    ]);
    mockAxios.onGet('http://127.0.0.1:8000/utilisateurs/SemestresAutoCompletionView/').reply(200, [
      { id: 1, nom_semestre: 'Semestre 1' },
    ]);

    render(<JournalDeFormationForm />);

    userEvent.type(screen.getByPlaceholderText('Rechercher un groupe'), 'Groupe');
    await waitFor(() => expect(screen.getByText('Groupe A')).toBeInTheDocument());
    userEvent.click(screen.getByText('Groupe A'));

    userEvent.type(screen.getByPlaceholderText('Rechercher un semestre'), 'Semestre');
    await waitFor(() => expect(screen.getByText('Semestre 1')).toBeInTheDocument());
    userEvent.click(screen.getByText('Semestre 1'));

    userEvent.click(screen.getByText('Créer Journal de Formation'));

    // Vérifier que l'API a bien été appelée et que la réponse est affichée
    await waitFor(() => expect(screen.getByText('Journal de formation créé avec succès')).toBeInTheDocument());
  });

  test('handles form submission error', async () => {
    // Mock de la réponse en erreur de l'API
    mockAxios.onPost('http://127.0.0.1:8000/utilisateurs/journaux/creer/').reply(500, {
      detail: 'Erreur interne du serveur',
    });
    mockAxios.onGet('http://127.0.0.1:8000/utilisateurs/GroupesAutoCompletionView/').reply(200, [
      { id: 1, nom_groupe: 'Groupe A' },
    ]);
    mockAxios.onGet('http://127.0.0.1:8000/utilisateurs/SemestresAutoCompletionView/').reply(200, [
      { id: 1, nom_semestre: 'Semestre 1' },
    ]);

    render(<JournalDeFormationForm />);

    userEvent.type(screen.getByPlaceholderText('Rechercher un groupe'), 'Groupe');
    await waitFor(() => expect(screen.getByText('Groupe A')).toBeInTheDocument());
    userEvent.click(screen.getByText('Groupe A'));

    userEvent.type(screen.getByPlaceholderText('Rechercher un semestre'), 'Semestre');
    await waitFor(() => expect(screen.getByText('Semestre 1')).toBeInTheDocument());
    userEvent.click(screen.getByText('Semestre 1'));

    userEvent.click(screen.getByText('Créer Journal de Formation'));

    // Vérifier que le message d'erreur est affiché
    await waitFor(() => expect(screen.getByText('Erreur : Erreur interne du serveur')).toBeInTheDocument());
  });

  test('closes the form when cancel button is clicked', () => {
    render(<JournalDeFormationForm />);

    // Vérifier que le formulaire est affiché initialement
    expect(screen.getByText('Créer un Journal de Formation')).toBeInTheDocument();

    // Cliquer sur le bouton d'annulation
    userEvent.click(screen.getByText('×'));

    // Vérifier que le formulaire est masqué
    expect(screen.queryByText('Créer un Journal de Formation')).not.toBeInTheDocument();
  });
});
