import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InviteUserForm from '../components/AddUser';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Création d'un mock pour axios
const mockAxios = new MockAdapter(axios);

describe('InviteUserForm', () => {
    beforeEach(() => {
        mockAxios.reset();
    });

    test('renders form elements correctly', () => {
        render(<InviteUserForm />);

        // Vérifier si les éléments du formulaire sont présents
        expect(screen.getByLabelText(/Role/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Nom/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Prénom/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Responsable Cursus/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /ANNULER/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /ENVOYER INVITATION/i })).toBeInTheDocument();
    });

    test('handles form input changes correctly', () => {
        render(<InviteUserForm />);

        // Saisir des données dans le formulaire
        userEvent.type(screen.getByLabelText(/Email/i), 'test@example.com');
        userEvent.type(screen.getByLabelText(/Nom/i), 'John');
        userEvent.type(screen.getByLabelText(/Prénom/i), 'Doe');
        userEvent.selectOptions(screen.getByLabelText(/Role/i), '1'); // Sélectionner Admin

        // Vérifier si les valeurs des champs sont mises à jour
        expect(screen.getByLabelText(/Email/i).value).toBe('test@example.com');
        expect(screen.getByLabelText(/Nom/i).value).toBe('John');
        expect(screen.getByLabelText(/Prénom/i).value).toBe('Doe');
        expect(screen.getByLabelText(/Role/i).value).toBe('1');
    });

    test('submits form with valid data', async () => {
        render(<InviteUserForm />);

        // Saisir des données dans le formulaire
        userEvent.type(screen.getByLabelText(/Email/i), 'test@example.com');
        userEvent.type(screen.getByLabelText(/Nom/i), 'John');
        userEvent.type(screen.getByLabelText(/Prénom/i), 'Doe');
        userEvent.selectOptions(screen.getByLabelText(/Role/i), '1'); // Sélectionner Admin

        // Mock de la réponse de l'API
        mockAxios.onPost('http://127.0.0.1:8000/utilisateurs/add-user/').reply(200, { message: 'Invitation envoyée avec succès!' });

        // Soumettre le formulaire
        userEvent.click(screen.getByRole('button', { name: /ENVOYER INVITATION/i }));

        // Attendre la mise à jour du message
        await waitFor(() => expect(screen.getByText(/Invitation envoyée avec succès!/)).toBeInTheDocument());
    });

    test('handles submit error response', async () => {
        render(<InviteUserForm />);

        // Saisir des données dans le formulaire
        userEvent.type(screen.getByLabelText(/Email/i), 'test@example.com');
        userEvent.type(screen.getByLabelText(/Nom/i), 'John');
        userEvent.type(screen.getByLabelText(/Prénom/i), 'Doe');
        userEvent.selectOptions(screen.getByLabelText(/Role/i), '1'); // Sélectionner Admin

        // Mock d'une erreur de l'API
        mockAxios.onPost('http://127.0.0.1:8000/utilisateurs/add-user/').reply(500, { error: 'Erreur serveur' });

        // Soumettre le formulaire
        userEvent.click(screen.getByRole('button', { name: /ENVOYER INVITATION/i }));

        // Attendre la mise à jour du message d'erreur
        await waitFor(() => expect(screen.getByText(/Erreur: Erreur serveur/)).toBeInTheDocument());
    });

    test('handles cancel button click', () => {
        render(<InviteUserForm />);

        // Vérifier si le formulaire est visible au début
        expect(screen.getByRole('form')).toBeInTheDocument();

        // Cliquer sur le bouton ANNULER
        userEvent.click(screen.getByRole('button', { name: /ANNULER/i }));

        // Vérifier que le formulaire n'est plus visible
        expect(screen.queryByRole('form')).not.toBeInTheDocument();
    });

    test('handles close button click', () => {
        render(<InviteUserForm />);

        // Vérifier si le formulaire est visible au début
        expect(screen.getByRole('form')).toBeInTheDocument();

        // Cliquer sur le bouton de fermeture
        userEvent.click(screen.getByRole('button', { name: /×/ }));

        // Vérifier que le formulaire n'est plus visible
        expect(screen.queryByRole('form')).not.toBeInTheDocument();
    });
});
