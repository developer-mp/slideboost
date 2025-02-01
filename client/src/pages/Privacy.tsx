import { Col, Container, Row } from "react-bootstrap";

const Privacy: React.FC = () => {
  return (
    <Container className="tw-text-center tw-mt-12 tw-mb-12">
      <Row className="justify-content-center">
        <Col xs={14} md={12} lg={10}>
          <h4 className="tw-mb-12 tw-font-bold tw-text-custom-color-blue">
            PRIVACY NOTICE
          </h4>
          <h6 className="tw-mb-4 tw-font-bold tw-mx-auto tw-max-w-3xl tw-text-justify">
            Last updated January 1, 2025
          </h6>
          <hr className="tw-mb-4 tw-text-gray-900 tw-mx-auto tw-max-w-3xl" />
          <div className="tw-text-gray-700 tw-mx-auto tw-max-w-3xl tw-text-justify">
            <p className="tw-mb-4">
              This privacy notice for SlideBoost
              <strong> ("we," "us," or "our") </strong>
              describes how and why we might collect, store, use, and/or share
              <strong> ("process") </strong> your information when you use our
              services
              <strong> ("Services") </strong>, such as when you:
            </p>
            <ul className="tw-list-disc tw-list-inside">
              <li>
                Visit our website at slideboost.io, or any website of ours that
                links to this privacy notice
              </li>
              <li>
                Engage with us in other related ways, including any sales,
                marketing, or events
              </li>
            </ul>
            <p className="tw-mb-4">
              <strong>
                While we take the privacy of your personal data seriously, we
                are not responsible for the content or privacy practices of any
                third-party websites that may be linked to or from our website.
                Additionally, we are not responsible for any damage, loss,
                theft, or misuse of data that may occur, including but not
                limited to incidents arising from malicious activities or any
                unauthorized access.
              </strong>
            </p>
            <p className="tw-mb-12">
              <strong>
                By using SlideBoost Services, you are consenting to the
                practices described in this Privacy Policy. If you do not agree
                with our policies and practices, please do not use our Services.
              </strong>
            </p>
            <h5 className="tw-font-bold tw-mb-8 tw-text-gray-900">
              SUMMARY OF KEY POINTS
            </h5>
            <p className="tw-mb-4 tw-font-bold">
              This summary provides key points from our privacy notice, but you
              can find out more details about any of these topics by clicking
              the link following each key point or by using our{" "}
              <a href="#table">table of contents</a> below to find the section
              you are looking for.
            </p>
            <p className="tw-mb-4">
              <strong>What personal information do we process?</strong> When you
              visit, use, or navigate our Services, we may process personal
              information depending on how you interact with us and the
              Services, the choices you make, and the products and features you
              use.{" "}
              <a href="#collect-info">
                Learn more about personal information you disclose to us.
              </a>
            </p>
            <p className="tw-mb-4">
              <strong>Do we process any sensitive personal information?</strong>{" "}
              We do not process sensitive personal information.
            </p>
            <p className="tw-mb-4">
              <strong>Do we collect any information from third parties?</strong>{" "}
              We do not collect any information from third parties.
            </p>
            <p className="tw-mb-4">
              <strong>How do we process your information?</strong> We process
              your information to provide, improve, and administer our Services,
              communicate with you, for security and fraud prevention, and to
              comply with the law. We may also process your information for
              other purposes with your consent. We process your information only
              when we have a valid legal reason to do so.{" "}
              <a href="#process-info">
                Learn more about how we process your information.
              </a>
            </p>
            <p className="tw-mb-4">
              <strong>
                In what situations and with which parties do we share personal
                information?
              </strong>{" "}
              We may share information in specific situations and with specific
              third parties.{" "}
              <a href="#share-info">
                Learn more about when and with whom we share your personal
                information.
              </a>
            </p>
            <p className="tw-mb-4">
              <strong>How do we keep your information safe?</strong> We have
              organizational and technical processes and procedures in place to
              protect your personal information. However, no electronic
              transmission over the internet or information storage technology
              can be guaranteed to be 100% secure, so we cannot promise or
              guarantee that hackers, cybercriminals, or other unauthorized
              third parties will not be able to defeat our security and
              improperly collect, access, steal, or modify your information.{" "}
              <a href="#keep-info-safe">
                Learn more about how we keep your information safe.
              </a>
            </p>
            <p className="tw-mb-4">
              <strong>What are your rights?</strong> Depending on where you are
              located geographically, the applicable privacy law may mean you
              have certain rights regarding your personal information.{" "}
              <a href="#privacy-rights">
                Learn more about your privacy rights.
              </a>
            </p>
            <p className="tw-mb-12">
              <strong>How do you exercise your rights?</strong> The easiest way
              to exercise your rights by contacting us. We will consider and act
              upon any request in accordance with applicable data protection
              laws.
            </p>
            <h5 id="table" className="tw-font-bold tw-mb-8 tw-text-gray-900">
              TABLE OF CONTENTS
            </h5>
            <div>
              <a href="#collect-info">1. WHAT INFORMATION DO WE COLLECT?</a>
            </div>
            <div>
              <a href="#process-info">2. HOW DO WE PROCESS YOUR INFORMATION?</a>
            </div>
            <div>
              <a href="#legal-bases">
                3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR PERSONAL
                INFORMATION?
              </a>
            </div>
            <div>
              <a href="#share-info">
                4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
              </a>
            </div>
            <div>
              <a href="#cookies">
                5. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?
              </a>
            </div>
            <div>
              <a href="#logins">6. HOW DO WE HANDLE YOUR SOCIAL LOGINS?</a>
            </div>
            <div>
              <a href="#keep-info-long">
                7. HOW LONG DO WE KEEP YOUR INFORMATION?
              </a>
            </div>
            <div>
              <a href="#keep-info-safe">
                8. HOW DO WE KEEP YOUR INFORMATION SAFE?
              </a>
            </div>
            <div>
              <a href="#privacy-rights">9. WHAT ARE YOUR PRIVACY RIGHTS?</a>
            </div>
            <div>
              <a href="#do-not-track">10. CONTROLS FOR DO-NOT-TRACK FEATURES</a>
            </div>
            <div>
              <a href="#specific-rights-us">
                11. DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?
              </a>
            </div>
            <div>
              <a href="#specific-rights-other">
                12. DO OTHER REGIONS HAVE SPECIFIC PRIVACY RIGHTS?
              </a>
            </div>
            <div>
              <a href="#notice-updates">
                13. DO WE MAKE UPDATES TO THIS NOTICE?
              </a>
            </div>
            <div>
              <a href="#contact">
                14. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
              </a>
            </div>
            <div className="tw-mb-12">
              <a href="#update-data">
                15. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT
                FROM YOU?
              </a>
            </div>
            <h5
              id="collect-info"
              className="tw-font-bold tw-mb-8 tw-text-gray-900"
            >
              1. WHAT INFORMATION DO WE COLLECT?
            </h5>
            <p className="tw-mb-4 tw-font-bold">
              Personal information you disclose to us
            </p>
            <p className="tw-mb-4 tw-italic">
              <strong>In Short:</strong> We collect personal information that
              you provide to us.
            </p>
            <p className="tw-mb-4">
              We collect personal information that you voluntarily provide to us
              when you register on the Services, express an interest in
              obtaining information about us or our products and Services, when
              you participate in activities on the Services, or otherwise when
              you contact us.
            </p>
            <p className="tw-mb-4">
              <strong> Personal Information Provided by You. </strong>
              The personal information that we collect depends on the context of
              your interactions with us and the Services, the choices you make,
              and the products and features you use. The personal information we
              collect may include the following:
            </p>
            <ul className="tw-list-disc tw-list-inside">
              <li>names</li>
              <li>email addresses</li>
              <li>usernames</li>
              <li>passwords</li>
              <li>contact preferences</li>
              <li>contact or authentication data</li>
              <li>billing addresses</li>
              <li>debit/credit card numbers</li>
            </ul>
            <p className="tw-mb-4">
              <strong> Sensitive Information. </strong>
              We do not process sensitive information.
            </p>
            <p className="tw-mb-4">
              <strong> Payment Data. </strong>
              We may collect data necessary to process your payment if you
              choose to make purchases, such as your payment instrument number,
              and the security code associated with your payment instrument. All
              payment data is handled and stored by Stripe. You may find their
              privacy notice link(s) here:{" "}
              <a
                href="https://stripe.com/en-ca/legal/privacy-center"
                target="_blank"
              >
                Stripe Privacy Center
              </a>
            </p>
            <p className="tw-mb-4">
              <strong> Social Media Login Data.</strong>
              We may provide you with the option to register with us using your
              existing social media account details, like your Facebook, X, or
              other social media account. If you choose to register in this way,
              we will collect certain profile information about you from the
              social media provider, as described in the section called{" "}
              <a href="#logins">"HOW DO WE HANDLE YOUR SOCIAL LOGINS?"</a>{" "}
              below.
            </p>
            <p className="tw-mb-12">
              All personal information that you provide to us must be true,
              complete, and accurate, and you must notify us of any changes to
              such personal information.
            </p>
            <h5
              id="process-info"
              className="tw-font-bold tw-mb-8 tw-text-gray-900"
            >
              2. HOW DO WE PROCESS YOUR INFORMATION?
            </h5>
            <p className="tw-mb-4 tw-italic">
              <strong> In Short: </strong> We process your information to
              provide, improve, and administer our Services, communicate with
              you, for security and fraud prevention, and to comply with law. We
              may also process your information for other purposes with your
              consent.
            </p>
            <p className="tw-mb-4 tw-font-bold">
              We process your personal information for a variety of reasons,
              depending on how you interact with our Services, including:
            </p>
            <ul className="tw-list-disc tw-list-inside tw-mb-12">
              <li>
                <strong>
                  To facilitate account creation and authentication and
                  otherwise manage user accounts.
                </strong>
                We may process your information so you can create and log in to
                your account, as well as keep your account in working order.
              </li>
              <li>
                <strong>
                  To save or protect an individual's vital interest.
                </strong>
                We may process your information when necessary to save or
                protect an individual's vital interest, such as to prevent harm.
              </li>
            </ul>
            <h5
              id="legal-bases"
              className="tw-font-bold tw-mb-8 tw-text-gray-900"
            >
              3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR INFORMATION?
            </h5>
            <p className="tw-mb-4 tw-italic">
              <strong> In Short: </strong> We only process your personal
              information when we believe it is necessary and we have a valid
              legal reason (i.e., legal basis) to do so under applicable law,
              like with your consent, to comply with laws, to provide you with
              services to enter into or fulfill our contractual obligations, to
              protect your rights, or to fulfill our legitimate business
              interests.
            </p>
            <p className="tw-mb-4 tw-font-bold tw-underline tw-italic">
              If you are located in the EU or UK, this section applies to you.
            </p>
            <p className="tw-mb-4">
              The General Data Protection Regulation (GDPR) and UK GDPR require
              us to explain the valid legal bases we rely on in order to process
              your personal information. As such, we may rely on the following
              legal bases to process your personal information:
            </p>
            <ul className="tw-list-disc tw-list-inside tw-mb-4">
              <li>
                <strong>Consent:</strong> We may process your information if you
                have given us permission (i.e., consent) to use your personal
                information for a specific purpose. You can withdraw your
                consent at any time by contacting us.
              </li>
              <li>
                <strong>Legal Obligations:</strong> We may process your
                information where we believe it is necessary for compliance with
                our legal obligations, such as to cooperate with a law
                enforcement body or regulatory agency, exercise or defend our
                legal rights, or disclose your information as evidence in
                litigation in which we are involved.
              </li>
              <li>
                <strong>Vital Interests:</strong> We may process your
                information where we believe it is necessary to protect your
                vital interests or the vital interests of a third party, such as
                situations involving potential threats to the safety of any
                person.
              </li>
            </ul>
            <p className="tw-mb-4 tw-font-bold tw-underline tw-italic">
              If you are located in Canada, this section applies to you.
            </p>
            <p className="tw-mb-4">
              We may process your information if you have given us specific
              permission (i.e., express consent) to use your personal
              information for a specific purpose, or in situations where your
              permission can be inferred (i.e., implied consent). You can
              withdraw your consent at any time by contacting us.
            </p>
            <p className="tw-mb-4">
              In some exceptional cases, we may be legally permitted under
              applicable law to process your information without your consent,
              including, for example:
            </p>
            <ul className="tw-list-disc tw-list-inside tw-mb-12">
              <li>
                If collection is clearly in the interests of an individual and
                consent cannot be obtained in a timely way
              </li>
              <li>For investigations and fraud detection and prevention</li>
              <li>
                For business transactions provided certain conditions are met
              </li>
              <li>
                If it is contained in a witness statement and the collection is
                necessary to assess, process, or settle an insurance claim
              </li>
              <li>
                For identifying injured, ill, or deceased persons and
                communicating with next of kin
              </li>
              <li>
                If we have reasonable grounds to believe an individual has been,
                is, or may be a victim of financial abuse
              </li>
              <li>
                If it is reasonable to expect collection and use with consent
                would compromise the availability or the accuracy of the
                information and the collection is reasonable for purposes
                related to investigating a breach of an agreement or a
                contravention of the laws of Canada or a province
              </li>
              <li>
                If disclosure is required to comply with a subpoena, warrant,
                court order, or rules of the court relating to the production of
                records
              </li>
              <li>
                If it was produced by an individual in the course of their
                employment, business, or profession and the collection is
                consistent with the purposes for which the information was
                produced
              </li>
              <li>
                If the collection is solely for journalistic, artistic, or
                literary purposes
              </li>
              <li>
                If the information is publicly available and is specified by the
                regulations
              </li>
            </ul>
            <h5
              id="share-info"
              className="tw-font-bold tw-mb-8 tw-text-gray-900"
            >
              4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
            </h5>
            <p className="tw-mb-4 tw-italic">
              <strong>In Short:</strong> We may share information in specific
              situations described in this section and/or with the following
              third parties.
            </p>
            <p className="tw-mb-4">
              We may need to share your personal information in the following
              situations:
            </p>
            <ul className="tw-list-disc tw-list-inside tw-mb-12">
              <li>
                <strong>Business Transfers.</strong> We may share or transfer
                your information in connection with, or during negotiations of,
                any merger, sale of company assets, financing, or acquisition of
                all or a portion of our business to another company.
              </li>
            </ul>
            <h5 id="cookies" className="tw-font-bold tw-mb-8 tw-text-gray-900">
              5. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?
            </h5>
            <p className="tw-mb-4 tw-italic">
              <strong>In Short:</strong> We may use cookies and other tracking
              technologies to collect and store your information.
            </p>
            <p className="tw-mb-4">
              We may use cookies and similar tracking technologies (like web
              beacons and pixels) to gather information when you interact with
              our Services. Some online tracking technologies help us maintain
              the security of our Services and your account, prevent crashes,
              fix bugs, save your preferences, and assist with basic site
              functions.
            </p>
            <p className="tw-mb-4">
              We also permit third parties and service providers to use online
              tracking technologies on our Services for analytics and
              advertising, including to help manage and display advertisements,
              to tailor advertisements to your interests, or to send abandoned
              shopping cart reminders (depending on your communication
              preferences). The third parties and service providers use their
              technology to provide advertising about products and services
              tailored to your interests which may appear either on our Services
              or on other websites. To the extent these online tracking
              technologies are deemed to be a "sale"/"sharing" (which includes
              targeted advertising, as defined under the applicable laws) under
              applicable US state laws, you can opt out of these online tracking
              technologies by submitting a request as described below under
              section{" "}
              <a href="#specific-rights-us">
                DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?"
              </a>
            </p>
            <p className="tw-mb-12">
              Specific information about how we use such technologies and how
              you can refuse certain cookies is set out in our Cookie Notice:
            </p>
            <h5 id="logins" className="tw-font-bold tw-mb-8 tw-text-gray-900">
              6. HOW DO WE HANDLE YOUR SOCIAL LOGINS?
            </h5>
            <p className="tw-mb-4 tw-italic">
              <strong>In Short:</strong> If you choose to register or log in to
              our Services using a social media account, we may have access to
              certain information about you.
            </p>
            <p className="tw-mb-4">
              Our Services offer you the ability to register and log in using
              your third-party social media account details (like your Facebook
              or X logins). Where you choose to do this, we will receive certain
              profile information about you from your social media provider. The
              profile information we receive may vary depending on the social
              media provider concerned, but will often include your name, email
              address, friends list, and profile picture, as well as other
              information you choose to make public on such a social media
              platform.
            </p>
            <p className="tw-mb-12">
              We will use the information we receive only for the purposes that
              are described in this privacy notice or that are otherwise made
              clear to you on the relevant Services. Please note that we do not
              control, and are not responsible for, other uses of your personal
              information by your third-party social media provider. We
              recommend that you review their privacy notice to understand how
              they collect, use, and share your personal information, and how
              you can set your privacy preferences on their sites and apps.
            </p>
            <h5
              id="keep-info-long"
              className="tw-font-bold tw-mb-8 tw-text-gray-900"
            >
              7. HOW LONG DO WE KEEP YOUR INFORMATION?
            </h5>
            <p className="tw-mb-4 tw-italic">
              <strong>In Short:</strong> We keep your information for as long as
              necessary to fulfill the purposes outlined in this privacy notice
              unless otherwise required by law.
            </p>
            <p className="tw-mb-4">
              We will only keep your personal information for as long as it is
              necessary for the purposes set out in this privacy notice, unless
              a longer retention period is required or permitted by law (such as
              tax, accounting, or other legal requirements). No purpose in this
              notice will require us keeping your personal information for
              longer than the period of time in which users have an account with
              us.{" "}
            </p>
            <p className="tw-mb-12">
              When we have no ongoing legitimate business need to process your
              personal information, we will either delete or anonymize such
              information, or, if this is not possible (for example, because
              your personal information has been stored in backup archives),
              then we will securely store your personal information and isolate
              it from any further processing until deletion is possible.
            </p>
            <h5
              id="keep-info-safe"
              className="tw-font-bold tw-mb-8 tw-text-gray-900"
            >
              8. HOW DO WE KEEP YOUR INFORMATION SAFE?
            </h5>
            <p className="tw-mb-4 tw-italic">
              <strong>In Short:</strong> We aim to protect your personal
              information through a system of organizational and technical
              security measures.
            </p>
            <p className="tw-mb-12">
              We have implemented appropriate and reasonable technical and
              organizational security measures designed to protect the security
              of any personal information we process. However, despite our
              safeguards and efforts to secure your information, no electronic
              transmission over the Internet or information storage technology
              can be guaranteed to be 100% secure, so we cannot promise or
              guarantee that hackers, cybercriminals, or other unauthorized
              third parties will not be able to defeat our security and
              improperly collect, access, steal, or modify your information.
              Although we will do our best to protect your personal information,
              transmission of personal information to and from our Services is
              at your own risk. You should only access the Services within a
              secure environment.
            </p>
            <h5
              id="privacy-rights"
              className="tw-font-bold tw-mb-8 tw-text-gray-900"
            >
              9. WHAT ARE YOUR PRIVACY RIGHTS?
            </h5>
            <p className="tw-mb-4 tw-italic">
              <strong>In Short:</strong> Depending on your state of residence in
              the US or in some regions, such as the European Economic Area
              (EEA), United Kingdom (UK), Switzerland, and Canada, you have
              rights that allow you greater access to and control over your
              personal information. You may review, change, or terminate your
              account at any time, depending on your country, province, or state
              of residence.
            </p>
            <p className="tw-mb-4">
              In some regions (like the EEA, UK, Switzerland, and Canada), you
              have certain rights under applicable data protection laws. These
              may include the right (i) to request access and obtain a copy of
              your personal information, (ii) to request rectification or
              erasure; (iii) to restrict the processing of your personal
              information; (iv) if applicable, to data portability, and (v) not
              to be subject to automated decision-making. In certain
              circumstances, you may also have the right to object to the
              processing of your personal information. You can make such a
              request by contacting us using the contact details provided in the
              section{" "}
              <a href="#contact">HOW CAN YOU CONTACT US ABOUT THIS NOTICE?" </a>{" "}
              below.
            </p>
            <p className="tw-mb-4">
              We will consider and act upon any request in accordance with
              applicable data protection laws.{" "}
            </p>
            <p className="tw-mb-4">
              If you are located in the EEA or UK and you believe we are
              unlawfully processing your personal information, you also have the
              right to complain to your{" "}
              <a
                href="https://www.edpb.europa.eu/about-edpb/about-edpb/members_en"
                target="_blank"
              >
                Member State data protection authority
              </a>{" "}
              or{" "}
              <a href="https://ico.org.uk/" target="_blank">
                UK data protection authority.
              </a>
            </p>
            <p className="tw-mb-4">
              If you are located in Switzerland, you may contact the{" "}
              <a
                href="https://www.edoeb.admin.ch/edoeb/en/home.html"
                target="_blank"
              >
                Federal Data Protection and Information Commissioner.
              </a>
            </p>
            <p className="tw-mb-4">
              <strong>Withdrawing Your Consent.</strong> If we are relying on
              your consent to process your personal information, which may be
              express and/or implied consent depending on the applicable law,
              you have the right to withdraw your consent at any time. You can
              withdraw your consent at any time by contacting us using the
              contact details provided in the section{" "}
              <a href="#contact">"HOW CAN YOU CONTACT US ABOUT THIS NOTICE?"</a>{" "}
              below or updating your preferences.
            </p>
            <p className="tw-mb-4">
              However, please note that this will not affect the lawfulness of
              the processing before its withdrawal nor, when applicable law
              allows, will it affect the processing of your personal information
              conducted in reliance on lawful processing grounds other than
              consent.
            </p>
            <p className="tw-mb-4">
              <strong>
                Opting Out of Marketing and Promotional Communications.
              </strong>{" "}
              You can unsubscribe from our marketing and promotional
              communications at any time by clicking on the unsubscribe link in
              the emails that we send, or by contacting us using the details
              provided in the section{" "}
              <a href="#contact">"HOW CAN YOU CONTACT US ABOUT THIS NOTICE?"</a>{" "}
              below. You will then be removed from the marketing lists. However,
              we may still communicate with you - for example, to send you
              service-related messages that are necessary for the administration
              and use of your account, to respond to service requests, or for
              other non-marketing purposes.
            </p>
            <p className="tw-mb-4 tw-font-bold">Account Information</p>
            <p className="tw-mb-4">
              If you would at any time like to review or change the information
              in your account or terminate your account, you can:
            </p>
            <ul className="tw-list-disc tw-list-inside tw-mb-4">
              <li>
                Log in to your account settings and update your user account.
              </li>
            </ul>
            <p className="tw-mb-4">
              Upon your request to terminate your account, we will deactivate or
              delete your account and information from our active databases.
              However, we may retain some information in our files to prevent
              fraud, troubleshoot problems, assist with any investigations,
              enforce our legal terms and/or comply with applicable legal
              requirements.
            </p>
            <p className="tw-mb-12">
              <strong>Cookies and Similar Technologies.</strong> Most Web
              browsers are set to accept cookies by default. If you prefer, you
              can usually choose to set your browser to remove cookies and to
              reject cookies. If you choose to remove cookies or reject cookies,
              this could affect certain features or services of our Services.
              For further information, please see our Cookie Notice:
            </p>
            <h5
              id="do-not-track"
              className="tw-font-bold tw-mb-8 tw-text-gray-900"
            >
              10. CONTROLS FOR DO-NOT-TRACK FEATURES
            </h5>
            <p className="tw-mb-4">
              Most web browsers and some mobile operating systems and mobile
              applications include a Do-Not-Track ("DNT") feature or setting you
              can activate to signal your privacy preference not to have data
              about your online browsing activities monitored and collected. At
              this stage, no uniform technology standard for recognizing and
              implementing DNT signals has been finalized. As such, we do not
              currently respond to DNT browser signals or any other mechanism
              that automatically communicates your choice not to be tracked
              online. If a standard for online tracking is adopted that we must
              follow in the future, we will inform you about that practice in a
              revised version of this privacy notice.
            </p>
            <p className="tw-mb-12">
              California law requires us to let you know how we respond to web
              browser DNT signals. Because there currently is not an industry or
              legal standard for recognizing or honoring DNT signals, we do not
              respond to them at this time.
            </p>
            <h5
              id="specific-rights-us"
              className="tw-font-bold tw-mb-8 tw-text-gray-900"
            >
              11. DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?
            </h5>
            <p className="tw-mb-4 tw-italic">
              <strong>In Short:</strong> If you are a resident of California,
              Colorado, Connecticut, Delaware, Florida, Indiana, Iowa, Kentucky,
              Montana, New Hampshire, New Jersey, Oregon, Tennessee, Texas,
              Utah, or Virginia, you may have the right to request access to and
              receive details about the personal information we maintain about
              you and how we have processed it, correct inaccuracies, get a copy
              of, or delete your personal information. You may also have the
              right to withdraw your consent to our processing of your personal
              information. These rights may be limited in some circumstances by
              applicable law. More information is provided below.
            </p>
            <p className="tw-mb-4">
              <strong> Categories of Personal Information We Collect </strong>
              We do not process sensitive information.
            </p>
            <p className="tw-mb-4">
              We have collected the following categories of personal information
              in the past twelve (12) months:
            </p>
            <div className="tw-overflow-x-auto">
              <table className="tw-table-auto tw-w-full tw-mb-4 tw-border tw-border-gray-700">
                <thead>
                  <tr>
                    <th className="tw-border tw-border-gray-700 tw-px-4 tw-py-2 tw-font-bold tw-text-center">
                      Category
                    </th>
                    <th className=" tw-border tw-border-gray-700 tw-px-4 tw-py-2 tw-font-bold tw-text-center">
                      Examples
                    </th>
                    <th className=" tw-border tw-border-gray-700 tw-px-4 tw-py-2 tw-font-bold tw-text-center">
                      Collected
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="tw-border tw-px-4 tw-py-2  tw-text-left">
                      A. Identifiers
                    </td>
                    <td className="tw-border tw-px-4 tw-py-2">
                      Contact details, such as real name, alias, postal address,
                      telephone or mobile contact number, unique personal
                      identifier, online identifier, Internet Protocol address,
                      email address, and account name
                    </td>
                    <td className="tw-border tw-px-4 tw-py-2 tw-text-center">
                      YES
                    </td>
                  </tr>
                  <tr>
                    <td className="tw-border tw-px-4 tw-py-2 tw-text-left">
                      B. Personal information as defined in the California
                      Customer Records statute
                    </td>
                    <td className="tw-border tw-px-4 tw-py-2">
                      Name, contact information, education, employment,
                      employment history, and financial information
                    </td>
                    <td className="tw-border tw-px-4 tw-py-2 tw-text-center">
                      YES
                    </td>
                  </tr>
                  <tr>
                    <td className="tw-border tw-px-4 tw-py-2 tw-text-left">
                      C. Protected classification characteristics under state or
                      federal law
                    </td>
                    <td className="tw-border tw-px-4 tw-py-2">
                      Gender, age, date of birth, race and ethnicity, national
                      origin, marital status, and other demographic data
                    </td>
                    <td className="tw-border tw-px-4 tw-py-2 tw-text-center">
                      NO
                    </td>
                  </tr>
                  <tr>
                    <td className="tw-border tw-px-4 tw-py-2 tw-text-left">
                      D. Commercial information
                    </td>
                    <td className="tw-border tw-px-4 tw-py-2">
                      Transaction information, purchase history, financial
                      details, and payment information
                    </td>
                    <td className="tw-border tw-px-4 tw-py-2 tw-text-center">
                      NO
                    </td>
                  </tr>
                  <tr>
                    <td className="tw-border tw-px-4 tw-py-2 tw-text-left">
                      E. Biometric information
                    </td>
                    <td className="tw-border tw-px-4 tw-py-2">
                      Fingerprints and voiceprints
                    </td>
                    <td className="tw-border tw-px-4 tw-py-2 tw-text-center">
                      NO
                    </td>
                  </tr>
                  <tr>
                    <td className="tw-border tw-px-4 tw-py-2 tw-text-left">
                      F. Internet or other similar network activity
                    </td>
                    <td className="tw-border tw-px-4 tw-py-2">
                      Browsing history, search history, online behavior,
                      interest data, and interactions with our and other
                      websites, applications, systems, and advertisements
                    </td>
                    <td className="tw-border tw-px-4 tw-py-2 tw-text-center">
                      NO
                    </td>
                  </tr>
                  <tr>
                    <td className="tw-border tw-px-4 tw-py-2 tw-text-left">
                      G. Geolocation data
                    </td>
                    <td className="tw-border tw-px-4 tw-py-2">
                      Device location
                    </td>
                    <td className="tw-border tw-px-4 tw-py-2 tw-text-center">
                      NO
                    </td>
                  </tr>
                  <tr>
                    <td className="tw-border tw-px-4 tw-py-2 tw-text-left">
                      H. Audio, electronic, sensory, or similar information
                    </td>
                    <td className="tw-border tw-px-4 tw-py-2">
                      Images and audio, video, or call recordings created in
                      connection with our business activities
                    </td>
                    <td className="tw-border tw-px-4 tw-py-2 tw-text-center">
                      NO
                    </td>
                  </tr>
                  <tr>
                    <td className="tw-border tw-px-4 tw-py-2 tw-text-left">
                      I. Professional or employment-related information
                    </td>
                    <td className="tw-border tw-px-4 tw-py-2">
                      Business contact details in order to provide you our
                      Services at a business level or job title, work history,
                      and professional qualifications if you apply for a job
                      with us
                    </td>
                    <td className="tw-border tw-px-4 tw-py-2 tw-text-center">
                      NO
                    </td>
                  </tr>
                  <tr>
                    <td className="tw-border tw-px-4 tw-py-2 tw-text-left">
                      J. Education Information
                    </td>
                    <td className="tw-border tw-px-4 tw-py-2">
                      Student records and directory information
                    </td>
                    <td className="tw-border tw-px-4 tw-py-2 tw-text-center">
                      NO
                    </td>
                  </tr>
                  <tr>
                    <td className="tw-border tw-px-4 tw-py-2 tw-text-left">
                      K. Inferences drawn from collected personal information
                    </td>
                    <td className="tw-border tw-px-4 tw-py-2">
                      Inferences drawn from any of the collected personal
                      information listed above to create a profile or summary
                      about, for example, an individual's preferences and
                      characteristics
                    </td>
                    <td className="tw-border tw-px-4 tw-py-2 tw-text-center">
                      NO
                    </td>
                  </tr>
                  <tr>
                    <td className="tw-border tw-px-4 tw-py-2 tw-text-left">
                      L. Sensitive personal information
                    </td>
                    <td className="tw-border tw-px-4 tw-py-2"></td>
                    <td className="tw-border tw-px-4 tw-py-2 tw-text-center">
                      NO
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="tw-mb-4">
              We may also collect other personal information outside of these
              categories through instances where you interact with us in person,
              online, or by phone or mail in the context of:
            </p>
            <ul className="tw-list-disc tw-list-inside">
              <li>Receiving help through our customer support channels;</li>
              <li>Participation in customer surveys or contests; and</li>
              <li>
                Facilitation in the delivery of our Services and to respond to
                your inquiries.
              </li>
            </ul>
            <p className="tw-mb-4">
              We will use and retain the collected personal information as
              needed to provide the Services or for:
            </p>
            <ul className="tw-list-disc tw-list-inside">
              <li>Category B - As long as the user has an account with us</li>
              <li>Category H - As long as the user has an account with us</li>
            </ul>
            <p className="tw-mb-4 tw-font-bold">
              Sources of Personal Information
            </p>
            <p className="tw-mb-4">
              Learn more about the sources of personal information we collect in{" "}
              <a href="#collect-info">"WHAT INFORMATION DO WE COLLECT?"</a>
            </p>
            <p className="tw-mb-4 tw-font-bold">
              How We Use and Share Personal Information
            </p>
            <p className="tw-mb-4">
              Learn about how we use your personal information in the section,{" "}
              <a href="#process-info">"HOW DO WE PROCESS YOUR INFORMATION?"</a>
            </p>
            <p className="tw-mb-4 tw-font-bold">
              Will your information be shared with anyone else?
            </p>
            <p className="tw-mb-4">
              We may disclose your personal information with our service
              providers pursuant to a written contract between us and each
              service provider. Learn more about how we disclose personal
              information in the section,{" "}
              <a href="#share-info">
                "WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?"
              </a>
            </p>
            <p className="tw-mb-4">
              We may use your personal information for our own business
              purposes, such as for undertaking internal research for
              technological development and demonstration. This is not
              considered to be "selling" of your personal information.
            </p>
            <p className="tw-mb-4">
              We have not disclosed, sold, or shared any personal information to
              third parties for a business or commercial purpose in the
              preceding twelve (12) months. We will not sell or share personal
              information in the future belonging to website visitors, users,
              and other consumers.
            </p>
            <p className="tw-mb-4 tw-font-bold">Your Rights</p>
            <p className="tw-mb-4">
              You have rights under certain US state data protection laws.
              However, these rights are not absolute, and in certain cases, we
              may decline your request as permitted by law. These rights
              include:
            </p>
            <ul className="tw-list-disc tw-list-inside tw-mb-4">
              <li>
                <strong> Right to know </strong>whether or not we are processing
                your personal data
              </li>
              <li>
                {" "}
                <strong>Right to access </strong>your personal data
              </li>
              <li>
                <strong>Right to correct </strong>inaccuracies in your personal
                data
              </li>
              <li>
                <strong>Right to request </strong> the deletion of your personal
                data
              </li>
              <li>
                <strong>Right to obtain a copy </strong>of the personal data you
                previously shared with us
              </li>
              <li>
                <strong>Right to non-discrimination </strong> for exercising
                your rights
              </li>
              <li>
                <strong>Right to opt out </strong> of the processing of your
                personal data if it is used for targeted advertising (or sharing
                as defined under California's privacy law), the sale of personal
                data, or profiling in furtherance of decisions that produce
                legal or similarly significant effects ("profiling")
              </li>
            </ul>
            <p className="tw-mb-4">
              Depending upon the state where you live, you may also have the
              following rights:
            </p>
            <ul className="tw-list-disc tw-list-inside tw-mb-4">
              <li>
                Right to obtain a list of the categories of third parties to
                which we have disclosed personal data (as permitted by
                applicable law, including California's and Delaware's privacy
                law)
              </li>
              <li>
                Right to obtain a list of specific third parties to which we
                have disclosed personal data (as permitted by applicable law,
                including Oregon's privacy law)
              </li>
              <li>
                Right to limit use and disclosure of sensitive personal data (as
                permitted by applicable law, including California's privacy law)
              </li>
              <li>
                Right to opt out of the collection of sensitive data and
                personal data collected through the operation of a voice or
                facial recognition feature (as permitted by applicable law,
                including Florida's privacy law)
              </li>
            </ul>
            <p className="tw-mb-4 tw-font-bold">How to Exercise Your Rights</p>
            <p className="tw-mb-4">
              To exercise these rights, you can contact us by visiting or by
              referring to the contact details at the bottom of this document.
              We will honor your opt-out preferences if you enact the{" "}
              <a href="https://globalprivacycontrol.org/" target="_blank">
                Global Privacy Control
              </a>{" "}
              (GPC) opt-out signal on your browser. Under certain US state data
              protection laws, you can designate an authorized agent to make a
              request on your behalf. We may deny a request from an authorized
              agent that does not submit proof that they have been validly
              authorized to act on your behalf in accordance with applicable
              laws.
            </p>
            <p className="tw-mb-4 tw-font-bold">Request Verification</p>
            <p className="tw-mb-4">
              Upon receiving your request, we will need to verify your identity
              to determine you are the same person about whom we have the
              information in our system. We will only use personal information
              provided in your request to verify your identity or authority to
              make the request. However, if we cannot verify your identity from
              the information already maintained by us, we may request that you
              provide additional information for the purposes of verifying your
              identity and for security or fraud-prevention purposes. If you
              submit the request through an authorized agent, we may need to
              collect additional information to verify your identity before
              processing your request and the agent will need to provide a
              written and signed permission from you to submit such request on
              your behalf.
            </p>
            <p className="tw-mb-4 tw-font-bold">Appeals</p>
            <p className="tw-mb-4">
              Under certain US state data protection laws, if we decline to take
              action regarding your request, you may appeal our decision by
              emailing us at. We will inform you in writing of any action taken
              or not taken in response to the appeal, including a written
              explanation of the reasons for the decisions. If your appeal is
              denied, you may submit a complaint to your state attorney general.
            </p>
            <p className="tw-mb-4 tw-font-bold">
              California "Shine The Light" Law
            </p>
            <p className="tw-mb-12">
              California Civil Code Section 1798.83, also known as the "Shine
              The Light" law, permits our users who are California residents to
              request and obtain from us, once a year and free of charge,
              information about categories of personal information (if any) we
              disclosed to third parties for direct marketing purposes and the
              names and addresses of all third parties with which we shared
              personal information in the immediately preceding calendar year.
              If you are a California resident and would like to make such a
              request, please submit your request in writing to us by using the
              contact details provided in the section{" "}
              <a href="#contact">"HOW CAN YOU CONTACT US ABOUT THIS NOTICE?"</a>
            </p>
            <h5
              id="specific-rights-other"
              className="tw-font-bold tw-mb-8 tw-text-gray-900"
            >
              12. DO OTHER REGIONS HAVE SPECIFIC PRIVACY RIGHTS?
            </h5>
            <p className="tw-mb-4 tw-italic">
              <strong>In Short:</strong> You may have additional rights based on
              the country you reside in.
            </p>
            <p className="tw-mb-4 tw-font-bold">Australia and New Zealand</p>
            <p className="tw-mb-4">
              We collect and process your personal information under the
              obligations and conditions set by Australia's Privacy Act 1988 and
              New Zealand's Privacy Act 2020 (Privacy Act).
            </p>
            <p className="tw-mb-4">
              This privacy notice satisfies the notice requirements defined in
              both Privacy Acts, in particular: what personal information we
              collect from you, from which sources, for which purposes, and
              other recipients of your personal information.{" "}
            </p>
            <p className="tw-mb-4">
              If you do not wish to provide the personal information necessary
              to fulfill their applicable purpose, it may affect our ability to
              provide our services, in particular:
            </p>
            <ul className="tw-list-disc tw-list-inside tw-mb-4">
              <li>Offer you the products or services that you want</li>
              <li>Respond to or help with your requests</li>
              <li>Manage your account with us</li>
              <li>Confirm your identity and protect your account</li>
            </ul>
            <p className="tw-mb-4">
              At any time, you have the right to request access to or correction
              of your personal information. You can make such a request by
              contacting us by using the contact details provided in the section{" "}
              <a href="#update-data">
                "HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM
                YOU?"
              </a>{" "}
            </p>
            <p className="tw-mb-4">
              If you believe we are unlawfully processing your personal
              information, you have the right to submit a complaint about a
              breach of the Australian Privacy Principles to the Office of the
              Australian Information Commissioner and a breach of New Zealand's
              Privacy Principles to the Office of New Zealand Privacy
              Commissioner.
            </p>
            <p className="tw-mb-4 tw-font-bold">Republic of South Africa</p>
            <p className="tw-mb-4">
              At any time, you have the right to request access to or correction
              of your personal information. You can make such a request by
              contacting us by using the contact details provided in the section{" "}
              <a href="#update-data">
                "HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM
                YOU?"
              </a>{" "}
            </p>
            <p className="tw-mb-4">
              If you are unsatisfied with the manner in which we address any
              complaint with regard to our processing of personal information,
              you can contact the office of the regulator, the details of which
              are:
            </p>
            <ul className="tw-list-disc tw-list-inside tw-mb-12">
              <li>The Information Regulator (South Africa)</li>
              <li>General enquiries: enquiries@inforegulator.org.za</li>
              <li>Complaints (complete POPIA/PAIA form 5)</li>
              <li>PAIAComplaints@inforegulator.org.za</li>
            </ul>
            <h5 id="notice-updates" className="tw-mb-8 tw-font-bold">
              13. DO WE MAKE UPDATES TO THIS NOTICE?
            </h5>
            <p className="tw-mb-4 tw-italic">
              <strong>In Short:</strong> Yes, we will update this notice as
              necessary to stay compliant with relevant laws.
            </p>
            <p className="tw-mb-12">
              We may update this privacy notice from time to time. The updated
              version will be indicated by an updated "Revised" date at the top
              of this privacy notice. If we make material changes to this
              privacy notice, we may notify you either by prominently posting a
              notice of such changes or by directly sending you a notification.
              We encourage you to review this privacy notice frequently to be
              informed of how we are protecting your information.
            </p>
            <h5 id="contact" className="tw-mb-8 tw-font-bold">
              14. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
            </h5>
            <p className="tw-mb-12">
              If you have questions or comments about this notice, you may email
              us at{" "}
              <a href="mailto:support@slideboost.io">support@slideboost.io</a>
            </p>
            <h5 id="#update-data" className="tw-mb-8 tw-font-bold">
              15. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM
              YOU?
            </h5>
            <p className="tw-mb-4">
              Based on the applicable laws of your country or state of residence
              in the US, you may have the right to request access to the
              personal information we collect from you, details about how we
              have processed it, correct inaccuracies, or delete your personal
              information. You may also have the right to withdraw your consent
              to our processing of your personal information. These rights may
              be limited in some circumstances by applicable law. To request to
              review, update, or delete your personal information, please
              contact us at{" "}
              <a href="mailto:support@slideboost.io">support@slideboost.io</a>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Privacy;
