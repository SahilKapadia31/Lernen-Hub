// translate.js

const data = {
    en: {
        navbar: {
            profile: "Profile",
            Settings: "Settings",
            Invite_friends: "Invite friends (+50 coins)",
            log_out: "Log out",
            add: "Upload",
            search: "Search subjects, documents or flashcards"
        },

        dashboard: {
            global_search: "Search subjects, documents or flashcards",
            add_btn: "Add",
            credits: 'Credit ponits',
            uploads: 'UPLOADS',
            recommended_documents: 'Recommended Documents',
            follower: 'Followers',
            news_feed: 'Engagement Feed',
            create_a_post: 'Create Post',
            view_all: 'View all',
            replies: "Replies",
            courses: "SUBJECTS",
            upvotes: "UPVOTES",
            reply_here: "Reply...",
            followed: 'Followed Posts'
        },

        common_words: {
            Save: "Save",
            Saved: "Saved",
            subjects: "Subjects",
            joined_courses: "Joined Subjects",
            recommended_courses: "Recommended Subjects",
            join: "Join",
            joined: "Joined",
            edit: "Edit",
            pin_comment: "Pin Comment",
            delete: "Delete",
            search_discussion: "Search Post",
            join_course: "Find More",
            upload: "Upload",
            search: "Search documents in this subject",
            flashset: "Search flashsets in this subject",
            upload_document: "Upload a document",
            create_flashcard: "Create Flashcard",
            join_group: "Join Group",
            group_search: "Search documents in this group",
            group_flashset: "Search flashsets in this group",
            super_coins: "Super Coins",
            discover: "Discover more",
            Cancel: "Cancel",
            Reset: "Reset",
            GoBack: "Go Back"
        },

        profile: {
            uploaded_doc: "Uploaded Documents",
            followed_doc: "Liked Documents",
            upload_flashcard: "Created Flashsets",
            followed_flashcard: "Saved Flashsets",
            super_coins: "Super Coins Earned"
        },

        signup_page: {
            signup: "Sign Up",
            country: "Country",
            city: "City",
            organization: "Organization",
            country_placeholder: "Select your country",
            city_placeholder: "Enter your city",
            organization_placeholder: "Select your Organization",
            next: "Next Step",
            already_have_account: "Already have an Account?",
            please_login_here: "Login Here",
            agree: "agree to terms & conditions",
            organization_mail: "Organization Email",
            password1: "Create Password",
            password2: "Confirm Password",
            password_placeholder1: "Create your Password",
            password_placeholder2: "Confirm your Password",
            get_otp: "Get OTP",
            otp_verification: "OTP Verification",
            verify_otp: "Verify OTP",
            resend_otp: "Resend OTP",
            change_email: "Change Email",
            welcome_message: "Welcome aboard! Let's start",
            first_name: "First Name",
            last_name: "Last Name",
            nick_name: "Nick Name",
            enter_your_course: "Enter your Program",
            add_course: "Add Program",
        },

        add_subjects: {
            add_subjects: "Add Subjects",
            skip: "Skip this for now",
            continue: "Continue",
        },

        login_page: {
            login: "Log in",
            email: " Email",
            password: "Password",
            forgot_password: "Forgot Password?",
            agree_to_terms: "Agree to terms &  conditions",
            submit: "Sign in",
            dont_have_account: "Don't have an account",
            get_started: "Create an Account"
        },

        group: {
            create_public_group: "Public Group",
            create_private_group: "Private Group",
            create_group: "Discover Groups...",
            search_module: "Search subjects",
            recommended_groups: "Recommended Groups",
            no_recommended_groups_ava: "No recommended groups available",
            no_joined_public_groups: "No joined public groups",
            group_name: "Group Name",
            category: "Category",
            scope: "Scope",
            group_description: "Group Description",
            placeholder: "Enter Group Id to Join",
            your_groups: "Your Groups",
            create: "Send Request",
            exit: "Exit",
            open_groups: "Public Group",
            private_group: "Private Groups",
            join_group: "Discover Groups",
            add_private_group: "Create New",
            add_public_group: "Create New"
        },
        show_pdf: {
            document_delete_note: "The requested document has already been deleted and is no longer available. If this deletion was unintentional or you require further assistance, please contact support or refer to backup records for retrieval options.",
            owner_user_message: "You have removed this document. Due to existing discussions, it remains available in a limited view mode. If this was unintentional or you want to remove it completely,please contact support.",
            normal_user_message: "This document has been removed by the contributor. However, due to existing discussions, it remains available in a limited view mode."
        },
        flashcard: {
            flashcard_Setting_title: "Adjust Speech Settings",
            var_setting_tone: "Play Vocal Tone",
            var_setting_vol: "Volume",
            var_setting_speed: "Play Speed",
            var_setting_voicetype:"Play Voice Type"
        },
        system_footer: {
            termsuse: "Terms of Use",
            privacy: "Privacy",
            about: "About Us",
            privacy_settings: "Privacy Settings"
        },
        public_group: {
            row1_A: "City-specific Groups",
            row1_B: "Connect with Study Friends",
            row1_C: "Diverse Discussions",
            row2_A: "Engage in Online Discussions",
            row2_B: "Join Popular Organization Groups",
            row2_C: "Stay Updated with Group Activities",
            row3_A: "Ask Questions",
            row3_B: "Participate in Conversations",
            row3_C: "Search suitable Groups",
            Joined_Public_Groups: "Joined Public Groups",
            Joined: "Joined",
            Search_Public_Group: "Search Public Group, Location, Category"
        },
        private_group: {
            row1_A: "Create Private Study Groups",
            row1_B: "Create Group & Share Id-Key to Join",
            row1_C: "Share Study Materials",
            row2_A: "Plan Private Study Sessions",
            row2_B: "Focused Discussions",
            row2_C: "Collaborative Learning",
            row3_A: "Ask Questions",
            row3_B: "Stay Organized",
            row3_C: "Private and Secure",
            Search_Private_Group: "Search Private Groups",
            Joined_Private_Groups: "Joined Private Groups",
        }
    },

    // German ////////
    ge: {
        navbar: {
            profile: "Profil",
            Settings: "Einstellungen",
            Invite_friends: "Freunde einladen (+50 Coins)",
            log_out: "Abmelden",
            add: "hochladen",
            search: "Durchsuchen Sie Module, Dokumente oder Karteikarten"
        },

        dashboard: {
            global_search: "Durchsuchen Sie Module, Dokumente oder Karteikarten",
            add_btn: "Saveeee",
            credits: 'CreditPunkte',
            uploads: 'UPLOADS',
            recommended_documents: 'Empfohlene Dokumente',
            follower: 'Follower',
            news_feed: 'Neuigkeiten',
            create_a_post: 'Beitrag erstellen',
            view_all: 'Alle ansehen',
            replies: "Antworten",
            courses: "KURSE",
            upvotes: "UPVOTES",
            reply_here: "Reply...",
            followed: 'Verfolgte Beiträge'
        },

        common_words: {
            Save: "Speichern",
            Saved: "Gespeichert",
            subjects: "Fächer",
            joined_courses: "Verbundene Kurse",
            recommended_courses: "Empfohlene Kurse",
            join: "Beitreten",
            joined: "beigetreten",
            edit: "Bearbeiten",
            pin_comment: "pinnen",
            delete: "Löschen",
            search_discussion: "Beitrag suchen",
            join_course: "Nehmen Sie am Kurs teil",
            upload: "Hochladen",
            search: "Durchsuchen Sie Dokumente in diesem Modul",
            flashset: 'Suchen Sie in diesem Modul nach Flashsets',
            upload_document: "Laden Sie ein Dokument hoch",
            create_flashcard: "Karteikarte erstellen",
            join_group: "Gruppe beitreten",
            group_search: "Suchen Sie nach Dokumenten oder Karteikarten in dieser Gruppe",
            group_flashset: 'Suchen Sie nach Dokumenten in dieser Gruppe',
            super_coins: "Supermünzen",
            discover: "Discover more",
            Cancel: "Abbrechen",
            Reset: "Zurücksetzen",
            GoBack: "Geh zurück"
        },

        profile: {
            uploaded_doc: "Hochgeladene Dokumente",
            followed_doc: "Gefolgte Dokumente",
            upload_flashcard: "Karteikarten erstellt",
            followed_flashcard: "Gespeicherte Karteikarten",
            super_coins: "Supermünzen verdient"
        },

        signup_page: {
            signup: "Registrieren",
            country: "Country",
            city: "City",
            organization: "Organization",
            country_placeholder: "Wähle dein Land",
            city_placeholder: "Wohnort eingeben",
            organization_placeholder: "Wähle deine Universität",
            next: "Nächster Schritt",
            already_have_account: "Sie haben bereits ein Konto?",
            please_login_here: "Bitte melden Sie sich hier an",
            agree: "AGBs akzeptieren",
            organization_mail: "E-Mail der Universität",
            password1: "Passwort erstellen",
            password2: "Passwort bestätigen",
            password_placeholder1: "Neues Passwort erstellen",
            password_placeholder2: "Passwort bestätigen",
            get_otp: "Holen Sie sich OTP",
            otp_verification: "OTP-Verifizierung",
            verify_otp: "OTP überprüfen",
            resend_otp: "OTP erneut senden",
            change_email: "E-Mail ändern",
            welcome_message: "Willkommen an Bord! Beginnen wir.",
            first_name: "Vorname",
            last_name: "Nachname",
            nick_name: "Spitzname",
            enter_your_course: "Wähle deinen Kurs",
            add_course: "Kurs hinzufügen",
        },

        add_subjects: {
            add_subjects: "Themen hinzufügen",
            skip: "Überspringe dies vorerst",
            continue: "Weiter",
        },

        login_page: {
            login: "Anmeldung",
            email: "E-Mail",
            password: "Passwort",
            forgot_password: "Passwort vergessen?",
            agree_to_terms: "Akzeptieren Sie die Allgemeinen Geschäftsbedingungen",
            submit: "Anmelden",
            dont_have_account: "Sie haben kein Konto",
            get_started: "Ein Konto erstellen"
        },

        group: {
            create_public_group: "Öffentliche Gruppe",
            create_private_group: "Private Gruppe",
            create_group: "Gruppe erstellen",
            search_module: "Suchmodule",
            recommended_groups: "Empfohlene Gruppen",
            no_recommended_groups_ava: "Keine empfohlenen Gruppen verfügbar",
            no_joined_public_groups: "Keinen öffentlichen Gruppen beigetreten",
            group_name: "Gruppenname",
            category: "Kategorie",
            scope: "Umfang",
            group_description: "Gruppenbeschreibung",
            placeholder: "Geben Sie die Gruppen-ID ein, der Sie beitreten möchten",
            your_groups: "Ihre Gruppen",
            create: "Anfrage Senden",
            exit: "Ausfahrt",
            open_groups: "Offene Gruppen",
            private_group: "Private Gruppen",
            join_group: "Gruppe beitreten",
            add_public_group: "Gruppe erstellen",
            add_private_group: "Gruppe erstellen"

        },
        show_pdf: {
            document_delete_note: "Das angeforderte Dokument wurde bereits gelöscht und ist nicht mehr verfügbar. Wenn diese Löschung unbeabsichtigt war oder Sie weitere Hilfe benötigen, wenden Sie sich bitte an den Support oder konsultieren Sie die Sicherungsaufzeichnungen für Abrufoptionen.",
            owner_user_message: "You have removed this document. Due to existing discussions, it remains available in a limited view mode. If this was unintentional or you want to remove it completely,please contact support.",
            normal_user_message: "This document has been removed by the contributor. However, due to existing discussions, it remains available in a limited view mode."
        },
        flashcard: {
            flashcard_Setting_title: "Spracheinstellungen anpassen",
            var_setting_tone: "Stimmton abspielen",
            var_setting_vol: "Lautstärke",
            var_setting_speed: "Wiedergabegeschwindigkeit",
            var_setting_voicetype:"Stimmtyp abspielen"
        },
        system_footer: {
            termsuse: "Nutzungsbedingungen",
            privacy: "Privatsphäre",
            about: "Über uns",
            privacy_settings: "Privatsphäre Einstellungen"
        },
        public_group: {
            row1_A: "Stadtspezifische Gruppen",
            row1_B: "Verbinde dich mit Study Friends",
            row1_C: "Vielfältige Diskussionen",
            row2_A: "Beteiligen Sie sich an Online-Diskussionen",
            row2_B: "Treten Sie beliebten Universitätsgruppen bei",
            row2_C: "Bleiben Sie über Gruppenaktivitäten auf dem Laufenden",
            row3_A: "Stellen Sie Fragen",
            row3_B: "Beteiligen Sie sich an Gesprächen",
            row3_C: "Suchen Sie nach geeigneten Gruppen",
            Joined_Public_Groups: "Beigetretene öffentliche Gruppen",
            Joined: "Beigetreten",
            Search_Public_Group: "Öffentliche Gruppe, Ort, Kategorie durchsuchen"
        },
        private_group: {
            row1_A: "Private Lerngruppen erstellen",
            row1_B: "Gruppe erstellen und ID-Schlüssel zum Beitritt teilen",
            row1_C: "Lernmaterialien teilen",
            row2_A: "Private Lernsitzungen planen",
            row2_B: "Gezielte Diskussionen",
            row2_C: "Gemeinsames Lernen",
            row3_A: "Fragen stellen",
            row3_B: "Organisiert bleiben",
            row3_C: "Privat und sicher",
            Search_Private_Group: "Private Gruppe durchsuchen"
        }
    }
};

export default data;
