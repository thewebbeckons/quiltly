<script setup lang="ts">
defineProps<{
  subject: string
  preview: string
  kicker: string
  title: string
  actionUrl: string
  actionLabel: string
}>()

const emailCss = `
  @font-face {
    font-family: "Newsreader";
    font-style: normal;
    font-weight: 500;
    src: url("https://fonts.gstatic.com/s/newsreader/v26/cY9qfjOCX1hbuyalUrK49dLac06G1ZGsZBtoBCzBDXXD9JVF438wSo_ADA.ttf") format("truetype");
  }

  @font-face {
    font-family: "Red Hat Mono";
    font-style: normal;
    font-weight: 500;
    src: url("https://fonts.gstatic.com/s/redhatmono/v16/jVyY7nDnA2uf2zVvFAhhzEs-VMSjJpBTfgjwQW_I-7E.ttf") format("truetype");
  }

  @media only screen and (max-width: 620px) {
    .email-gutter {
      padding: 20px 12px !important;
    }

    .email-card {
      padding: 32px 24px !important;
    }

    .email-title {
      font-size: 36px !important;
    }
  }
`
</script>

<template>
  <EHtml lang="en">
    <EHead>
      <meta
        name="color-scheme"
        content="light"
      >
      <meta
        name="supported-color-schemes"
        content="light"
      >
      <EStyle>{{ emailCss }}</EStyle>
    </EHead>

    <ESubject>{{ subject }}</ESubject>

    <EBody
      :style="{
        margin: '0',
        padding: '0',
        backgroundColor: '#fbf0dc',
        color: '#4a403a',
        fontFamily: 'Georgia, Times New Roman, serif'
      }"
    >
      <div id="__vue-email-preview">
        <EPreview>{{ preview }}</EPreview>
      </div>

      <table
        width="100%"
        border="0"
        cellpadding="0"
        cellspacing="0"
        role="presentation"
      >
        <tbody>
          <tr>
            <td
              align="center"
              class="email-gutter"
              style="padding: 36px 20px;"
            >
              <table
                width="100%"
                border="0"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="width: 100%; max-width: 600px;"
              >
                <tbody>
                  <tr>
                    <td style="padding: 0 0 16px;">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                      >
                        <tbody>
                          <tr>
                            <td style="padding-right: 10px;">
                              <table
                                width="28"
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                role="presentation"
                                aria-label=""
                                style="width: 28px; border: 1px solid #d3baa1;"
                              >
                                <tbody>
                                  <tr>
                                    <td
                                      width="13"
                                      height="13"
                                      style="width: 13px; height: 13px; background: #edacba;"
                                    />
                                    <td
                                      width="13"
                                      height="13"
                                      style="width: 13px; height: 13px; background: #f3d99f;"
                                    />
                                  </tr>
                                  <tr>
                                    <td
                                      width="13"
                                      height="13"
                                      style="width: 13px; height: 13px; background: #a4c9c6;"
                                    />
                                    <td
                                      width="13"
                                      height="13"
                                      style="width: 13px; height: 13px; background: #f4ad91;"
                                    />
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                            <td
                              style="font-family: Newsreader, Georgia, 'Times New Roman', serif; font-size: 23px; font-weight: 500; letter-spacing: -0.5px; color: #2f2a27;"
                            >
                              Quiltly
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td
                      class="email-card"
                      style="padding: 46px 48px 42px; background: #fff9ed; border: 1px solid #e7d8c6;"
                    >
                      <p style="margin: 0 0 18px; font-family: 'Red Hat Mono', 'Courier New', monospace; font-size: 11px; font-weight: 500; line-height: 1.4; letter-spacing: 1.2px; text-transform: uppercase; color: #76675d;">
                        {{ kicker }}
                      </p>

                      <h1
                        class="email-title"
                        style="margin: 0; font-family: Newsreader, Georgia, 'Times New Roman', serif; font-size: 44px; font-weight: 500; line-height: 1.02; letter-spacing: -1.6px; color: #2f2a27;"
                      >
                        {{ title }}
                      </h1>

                      <div style="margin-top: 22px; font-family: Newsreader, Georgia, 'Times New Roman', serif; font-size: 18px; line-height: 1.55; color: #5d524b;">
                        <slot />
                      </div>

                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="margin-top: 28px;"
                      >
                        <tbody>
                          <tr>
                            <td style="background: #b9533c;">
                              <a
                                :href="actionUrl"
                                target="_blank"
                                style="display: inline-block; padding: 14px 20px; font-family: 'Red Hat Mono', 'Courier New', monospace; font-size: 13px; font-weight: 500; line-height: 1; letter-spacing: -0.2px; color: #ffffff; text-decoration: none;"
                              >
                                {{ actionLabel }} →
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <div style="margin-top: 34px; padding-top: 20px; border-top: 1px dashed #d3baa1; font-family: Newsreader, Georgia, 'Times New Roman', serif; font-size: 14px; line-height: 1.55; color: #76675d;">
                        <slot name="note" />
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 16px 4px 0; font-family: 'Red Hat Mono', 'Courier New', monospace; font-size: 10px; line-height: 1.5; letter-spacing: 0.7px; text-transform: uppercase; color: #9b7e67;">
                      A considered home for your craft
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </EBody>
  </EHtml>
</template>
