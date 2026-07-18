revoke all on public.contact_messages from anon, authenticated;
grant select, update, delete on public.contact_messages to authenticated;

drop policy if exists "Public can send contact messages" on public.contact_messages;

create index if not exists contact_messages_email_created_idx on public.contact_messages (lower(email), created_at desc);

create or replace function public.submit_contact_message(
  p_name text,
  p_email text,
  p_subject text,
  p_message text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := lower(trim(p_email));
  v_id uuid;
begin
  if char_length(trim(p_name)) not between 2 and 120
    or char_length(v_email) not between 5 and 254
    or v_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    or char_length(trim(p_subject)) not between 2 and 180
    or char_length(trim(p_message)) not between 10 and 5000 then
    raise exception 'Confira os dados antes de enviar.' using errcode = '22023';
  end if;

  if exists (
    select 1 from public.contact_messages
    where lower(email) = v_email and created_at > now() - interval '60 seconds'
  ) then
    raise exception 'Aguarde um minuto antes de enviar outra mensagem.' using errcode = 'P0001';
  end if;

  if (
    select count(*) from public.contact_messages
    where lower(email) = v_email and created_at > now() - interval '1 hour'
  ) >= 5 then
    raise exception 'Limite temporário de mensagens atingido. Tente novamente mais tarde.' using errcode = 'P0001';
  end if;

  if exists (
    select 1 from public.contact_messages
    where lower(email) = v_email
      and lower(message) = lower(trim(p_message))
      and created_at > now() - interval '10 minutes'
  ) then
    raise exception 'Mensagem repetida. Aguarde antes de reenviar.' using errcode = 'P0001';
  end if;

  insert into public.contact_messages (name, email, subject, message)
  values (trim(p_name), v_email, trim(p_subject), trim(p_message))
  returning id into v_id;
  return v_id;
end;
$$;

revoke all on function public.submit_contact_message(text, text, text, text) from public;
grant execute on function public.submit_contact_message(text, text, text, text) to anon, authenticated;
